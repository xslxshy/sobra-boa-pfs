import { NextResponse } from "next/server";
import { lerBanco, salvarBanco } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const p = new URL(req.url).searchParams;
  const db = lerBanco();
  const agora = Date.now();

  let lista = db.ofertas.map((o) => {
    const vencida = o.status === "disponivel" && new Date(o.validade).getTime() < agora;
    const nome = (id) => db.usuarios.find((u) => String(u.id) === String(id))?.nome || null;
    return {
      ...o,
      status: vencida ? "vencida" : o.status,
      doadorNome: nome(o.doadorId),
      receptorNome: nome(o.receptorId),
      voluntarioNome: nome(o.voluntarioId)
    };
  });

  if (p.get("status")) lista = lista.filter((o) => o.status === p.get("status"));
  if (p.get("doadorId")) lista = lista.filter((o) => String(o.doadorId) === p.get("doadorId"));
  if (p.get("receptorId")) lista = lista.filter((o) => String(o.receptorId) === p.get("receptorId"));
  if (p.get("voluntarioId")) lista = lista.filter((o) => String(o.voluntarioId) === p.get("voluntarioId"));
  if (p.get("cidade")) {
    lista = lista.filter((o) => o.cidade.toLowerCase().includes(p.get("cidade").toLowerCase()));
  }

  lista.sort((a, b) => new Date(a.validade) - new Date(b.validade));
  return NextResponse.json(lista);
}

export async function POST(req) {
  const dados = await req.json();
  const db = lerBanco();
  const doador = db.usuarios.find((u) => String(u.id) === String(dados.doadorId));

  if (!doador || doador.perfil !== "doador") {
    return NextResponse.json({ erro: "Só doadores podem publicar alimentos" }, { status: 403 });
  }
  if (!dados.titulo || !dados.quantidade || !dados.validade) {
    return NextResponse.json({ erro: "Preencha alimento, quantidade e validade" }, { status: 400 });
  }
  if (new Date(dados.validade).getTime() <= Date.now()) {
    return NextResponse.json({ erro: "A validade precisa ser no futuro" }, { status: 400 });
  }

  const nova = {
    id: Date.now(),
    doadorId: doador.id,
    titulo: dados.titulo,
    descricao: dados.descricao || "",
    quantidade: Number(dados.quantidade),
    unidade: dados.unidade || "un",
    validade: new Date(dados.validade).toISOString(),
    rua: doador.rua,
    numero: doador.numero,
    bairro: doador.bairro,
    cidade: doador.cidade,
    status: "disponivel",
    receptorId: null,
    voluntarioId: null,
    precisaVoluntario: false
  };
  db.ofertas.push(nova);
  salvarBanco(db);
  return NextResponse.json(nova, { status: 201 });
}
