import { NextResponse } from "next/server";
import { lerBanco, salvarBanco } from "../../../lib/db";

export async function POST(req) {
  const dados = await req.json();
  const { nome, email, perfil, telefone, cep, rua, numero, bairro, cidade } = dados;

  if (!nome || !email || !perfil || !cidade) {
    return NextResponse.json({ erro: "Preencha nome, e-mail, perfil e CEP" }, { status: 400 });
  }
  if (!["doador", "receptor", "voluntario"].includes(perfil)) {
    return NextResponse.json({ erro: "Perfil inválido" }, { status: 400 });
  }

  const db = lerBanco();
  if (db.usuarios.find((u) => u.email === email)) {
    return NextResponse.json({ erro: "e-mail já está cadastrado" }, { status: 409 });
  }

  const novo = { id: Date.now(), nome, email, perfil, telefone, cep, rua, numero, bairro, cidade };
  db.usuarios.push(novo);
  salvarBanco(db);
  return NextResponse.json(novo, { status: 201 });
}
