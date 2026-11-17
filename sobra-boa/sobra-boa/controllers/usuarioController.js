import { NextResponse } from "next/server";
import { ErroHttp } from "../middlewares/erros";
import { INCLUIR } from "./ofertaController";
import { ofertaParaJson } from "../lib/formatar";

export async function listarOfertas(req, ctx, usuario) {
  if (String(usuario.id) !== String(ctx.params.id)) {
    throw new ErroHttp(403, "Você só pode ver as suas próprias ofertas.");
  }

  const opcoes = { include: INCLUIR, order: [["validade", "ASC"]] };
  let ofertas;
  if (usuario.perfil === "doador") ofertas = await usuario.getOfertasDoadas(opcoes);
  else if (usuario.perfil === "receptor") ofertas = await usuario.getReservas(opcoes);
  else ofertas = await usuario.getColetas(opcoes);

  return NextResponse.json(ofertas.map(ofertaParaJson));
}
