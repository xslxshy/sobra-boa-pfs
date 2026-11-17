import { Op } from "sequelize";
import { NextResponse } from "next/server";
import { Oferta, Usuario } from "../models";
import { ErroHttp } from "../middlewares/erros";
import { ofertaParaJson, pegarCampos } from "../lib/formatar";

export const INCLUIR = [
  { model: Usuario, as: "doador", attributes: ["id", "nome"] },
  { model: Usuario, as: "receptor", attributes: ["id", "nome"] },
  { model: Usuario, as: "voluntario", attributes: ["id", "nome"] }
];

const CAMPOS_OFERTA = ["titulo", "descricao", "quantidade", "unidade", "validade"];

async function buscar(id) {
  const oferta = await Oferta.findByPk(id, { include: INCLUIR });
  if (!oferta) throw new ErroHttp(404, "Oferta não encontrada.");
  return oferta;
}

export async function listar(req) {
  const p = new URL(req.url).searchParams;
  const agora = new Date();
  const where = {};
  const status = p.get("status");

  if (status === "disponivel") {
    where.status = "disponivel";
    where.validade = { [Op.gt]: agora };
  } else if (status === "vencida") {
    where.status = "disponivel";
    where.validade = { [Op.lte]: agora };
  } else if (status) {
    where.status = status;
  }
  if (p.get("cidade")) where.cidade = { [Op.like]: `%${p.get("cidade")}%` };
  if (p.get("precisaVoluntario") === "true") where.precisaVoluntario = true;
  if (p.get("semVoluntario") === "true") where.voluntarioId = null;

  const ofertas = await Oferta.findAll({ where, include: INCLUIR, order: [["validade", "ASC"]] });
  return NextResponse.json(ofertas.map(ofertaParaJson));
}

export async function criar(req, ctx, usuario) {
  if (!usuario.cidade) {
    throw new ErroHttp(400, "Complete seu endereço em Meu perfil antes de publicar.");
  }
  const dados = await req.json();
  const oferta = await Oferta.create({
    ...pegarCampos(dados, CAMPOS_OFERTA),
    doadorId: usuario.id,
    rua: usuario.rua,
    numero: usuario.numero,
    bairro: usuario.bairro,
    cidade: usuario.cidade
  });
  return NextResponse.json(ofertaParaJson(await buscar(oferta.id)), { status: 201 });
}

export async function mudarStatus(req, ctx, usuario) {
  const { acao, precisaVoluntario } = await req.json();
  const oferta = await buscar(ctx.params.id);

  if (acao === "reservar") {
    if (usuario.perfil !== "receptor") throw new ErroHttp(403, "Só receptores podem reservar.");
    const vencida = new Date(oferta.validade).getTime() < Date.now();
    if (oferta.status !== "disponivel" || vencida) throw new ErroHttp(409, "Esta oferta não está mais disponível.");
    oferta.status = "reservada";
    oferta.receptorId = usuario.id;
    oferta.precisaVoluntario = !!precisaVoluntario;
  } else if (acao === "aceitar") {
    if (usuario.perfil !== "voluntario") throw new ErroHttp(403, "Só voluntários podem aceitar coletas.");
    if (oferta.status !== "reservada" || !oferta.precisaVoluntario || oferta.voluntarioId) {
      throw new ErroHttp(409, "Esta coleta não está disponível.");
    }
    oferta.voluntarioId = usuario.id;
  } else if (acao === "entregar") {
    const doVoluntario = oferta.voluntarioId === usuario.id;
    const retiradaDoReceptor = oferta.receptorId === usuario.id && !oferta.precisaVoluntario;
    if (oferta.status !== "reservada" || (!doVoluntario && !retiradaDoReceptor)) {
      throw new ErroHttp(403, "Você não pode confirmar a entrega desta oferta.");
    }
    oferta.status = "entregue";
  } else if (acao === "cancelar") {
    if (oferta.doadorId !== usuario.id) throw new ErroHttp(403, "Esta oferta é de outro doador.");
    if (!["disponivel", "reservada"].includes(oferta.status)) throw new ErroHttp(409, "Não é possível cancelar agora.");
    oferta.status = "cancelada";
  } else {
    throw new ErroHttp(400, "Ação inválida. Use reservar, aceitar, entregar ou cancelar.");
  }

  await oferta.save();
  return NextResponse.json(ofertaParaJson(await buscar(oferta.id)));
}

export async function remover(req, ctx, usuario) {
  const oferta = await buscar(ctx.params.id);
  if (oferta.doadorId !== usuario.id) throw new ErroHttp(403, "Esta oferta é de outro doador.");
  if (["reservada", "entregue"].includes(oferta.status)) {
    throw new ErroHttp(409, "Não é possível excluir uma oferta reservada ou entregue.");
  }
  await oferta.destroy();
  return NextResponse.json({ ok: true });
}
