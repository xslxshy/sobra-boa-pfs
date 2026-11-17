import { ErroHttp } from "./erros";
import { Usuario } from "../models";
import { verificarToken } from "../lib/token";

export function autenticar(handler, perfis) {
  return async (req, ctx) => {
    const cabecalho = req.headers.get("authorization") || "";
    if (!cabecalho.startsWith("Bearer ")) {
      throw new ErroHttp(401, "Token não informado. Faça login.");
    }

    let dados;
    try {
      dados = verificarToken(cabecalho.slice(7));
    } catch (erro) {
      if (erro.name === "TokenExpiredError") {
        throw new ErroHttp(401, "Token expirado. Faça login novamente.");
      }
      throw new ErroHttp(401, "Token inválido.");
    }

    const usuario = await Usuario.findByPk(dados.id);
    if (!usuario) throw new ErroHttp(401, "O usuário deste token não existe mais.");

    if (perfis && !perfis.includes(usuario.perfil)) {
      throw new ErroHttp(403, "Seu perfil não tem permissão para esta ação.");
    }

    return handler(req, ctx, usuario);
  };
}
