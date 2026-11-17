import { requisicao } from "./requisicao";

/**
 * Envia uma ação para uma oferta específica
 * {string} idOferta - ID da oferta
 * {string} acao - a ação que vai ser enviada
 * {boolean} precisaVoluntario - ve se a ação precisa de um voluntário
 * {Promise} - retorna uma promise com o resultado da requisição
 */
export function enviarAcao(idOferta, acao, precisaVoluntario) {
  return requisicao(`/api/ofertas/${idOferta}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acao, precisaVoluntario })
  });
}
