import { requisicao } from "./requisicao";

export function enviarAcao(idOferta, acao, usuarioId, precisaVoluntario) {
  return requisicao(`/api/ofertas/${idOferta}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acao, usuarioId, precisaVoluntario })
  });
}
