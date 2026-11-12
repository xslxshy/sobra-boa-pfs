"use client";
import { useState } from "react";
import { requisicao } from "../../lib/requisicao";

export default function Login() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    try {
      const dados = await requisicao("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      localStorage.setItem("usuario", JSON.stringify(dados));
      window.location.href = "/painel";
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <main>
      <h1>Entrar</h1>
      <form onSubmit={entrar}>
        <div>
          <label>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {erro && <p className="mensagem erro">{erro}</p>}
        <button className="botao">Entrar</button>
      </form>
      <h3>contas de teste:</h3>
      <p>padaria@teste.com (doador)</p>
      <p>ong@teste.com (receptor)</p>
      <p>voluntario@teste.com (voluntário)</p>
    </main>
  );
}
