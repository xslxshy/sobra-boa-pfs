import jwt from "jsonwebtoken";

const segredo = process.env.JWT_SECRET || "segredo-de-desenvolvimento";

export function gerarToken(usuario) {
  return jwt.sign({ id: usuario.id, perfil: usuario.perfil }, segredo, {
    expiresIn: process.env.JWT_EXPIRA || "2h"
  });
}

export function verificarToken(token) {
  return jwt.verify(token, segredo);
}
