import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Usuario } from "../models";
import { ErroHttp } from "../middlewares/erros";
import { gerarToken } from "../lib/token";
import { pegarCampos, usuarioPublico } from "../lib/formatar";

const CAMPOS_CADASTRO = ["nome", "email", "perfil", "telefone", "cep", "rua", "numero", "bairro", "cidade"];

export async function cadastro(req) {
  const dados = await req.json();

  if (!dados.senha || String(dados.senha).length < 6) {
    throw new ErroHttp(400, "A senha deve ter pelo menos 6 caracteres.");
  }
  if (!dados.cidade) {
    throw new ErroHttp(400, "Busque o CEP para preencher o endereço.");
  }

  const usuario = await Usuario.create({
    ...pegarCampos(dados, CAMPOS_CADASTRO),
    senhaHash: bcrypt.hashSync(String(dados.senha), 10)
  });

  return NextResponse.json({ usuario: usuarioPublico(usuario), token: gerarToken(usuario) }, { status: 201 });
}

export async function login(req) {
  const { email, senha } = await req.json();
  const usuario = await Usuario.findOne({ where: { email: email || "" } });

  if (!usuario || !bcrypt.compareSync(String(senha || ""), usuario.senhaHash)) {
    throw new ErroHttp(401, "E-mail ou senha incorretos.");
  }

  return NextResponse.json({ usuario: usuarioPublico(usuario), token: gerarToken(usuario) });
}

export async function me(req, ctx, usuario) {
  return NextResponse.json(usuarioPublico(usuario));
}
