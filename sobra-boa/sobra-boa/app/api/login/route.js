import { NextResponse } from "next/server";
import { lerBanco } from "../../../lib/db";

export async function POST(req) {
  const { email } = await req.json();
  const db = lerBanco();
  const usuario = db.usuarios.find((u) => u.email === email);
  if (!usuario) {
    return NextResponse.json({ erro: "e-mail não encontrado." }, { status: 404 });
  }
  return NextResponse.json(usuario);
}
