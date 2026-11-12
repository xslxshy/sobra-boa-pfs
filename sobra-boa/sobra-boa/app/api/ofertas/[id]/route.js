import { NextResponse } from "next/server";
import { lerBanco, salvarBanco } from "../../../../lib/db";

function erro(mensagem, status) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function PATCH(req, { params }) {
  const { acao, usuarioId, precisaVoluntario } = await req.json();
  const db = lerBanco();
  const oferta = db.ofertas.find((o) => String(o.id) === String(params.id));
  const usuario = db.usuarios.find((u) => String(u.id) === String(usuarioId));

  if (!oferta) return erro("Oferta não encontrada", 404);
  if (!usuario) return erro("Faça login para continuar", 401);

  if (acao === "reservar") {
    if (usuario.perfil !== "receptor") return erro("Só receptores podem reservar", 403);
    const vencida = new Date(oferta.validade).getTime() < Date.now();
    if (oferta.status !== "disponivel" || vencida) return erro("Esta oferta não está mais disponível", 409);
    oferta.status = "reservada";
    oferta.receptorId = usuario.id;
    oferta.precisaVoluntario = !!precisaVoluntario;
  } else if (acao === "aceitar") {
    if (usuario.perfil !== "voluntario") return erro("Só voluntários podem aceitar coletas", 403);
    if (oferta.status !== "reservada" || !oferta.precisaVoluntario || oferta.voluntarioId) {
      return erro("Esta coleta não está disponível.", 409);
    }
    oferta.voluntarioId = usuario.id;
  } else if (acao === "entregar") {
    const voluntarioDaOferta = oferta.voluntarioId === usuario.id;
    const receptorRetirando = oferta.receptorId === usuario.id && !oferta.precisaVoluntario;
    if (oferta.status !== "reservada" || (!voluntarioDaOferta && !receptorRetirando)) {
      return erro("Você não pode confirmar a entrega desta oferta", 403);
    }
    oferta.status = "entregue";
  } else if (acao === "cancelar") {
    if (oferta.doadorId !== usuario.id) return erro("Esta oferta é de outro doador", 403);
    if (!["disponivel", "reservada"].includes(oferta.status)) return erro("Não é possível cancelar agora", 409);
    oferta.status = "cancelada";
  } else {
    return erro("Ação inválida.", 400);
  }

  salvarBanco(db);
  return NextResponse.json(oferta);
}

export async function DELETE(req, { params }) {
  const usuarioId = new URL(req.url).searchParams.get("usuarioId");
  const db = lerBanco();
  const oferta = db.ofertas.find((o) => String(o.id) === String(params.id));

  if (!oferta) return erro("Oferta não encontrada.", 404);
  if (String(oferta.doadorId) !== usuarioId) return erro("Esta oferta é de outro doador", 403);
  if (["reservada", "entregue"].includes(oferta.status)) return erro("Não é possível excluir esta oferta", 409);

  db.ofertas = db.ofertas.filter((o) => o.id !== oferta.id);
  salvarBanco(db);
  return NextResponse.json({ ok: true });
}
