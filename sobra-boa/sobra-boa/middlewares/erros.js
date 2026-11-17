import { NextResponse } from "next/server";
import { iniciarBanco } from "../models";

export class ErroHttp extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.statusHttp = status;
  }
}

function responder(status, mensagem) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export function tratarErros(handler) {
  return async (req, ctx) => {
    try {
      await iniciarBanco();
      return await handler(req, ctx);
    } catch (erro) {
      if (erro.statusHttp) return responder(erro.statusHttp, erro.message);
      if (erro.name === "SequelizeUniqueConstraintError") {
        return responder(409, "Já existe um cadastro com este e-mail.");
      }
      if (erro.name === "SequelizeValidationError") {
        return responder(400, erro.errors.map((e) => e.message).join(" "));
      }
      console.error(erro);
      return responder(500, "Erro interno do servidor.");
    }
  };
}
