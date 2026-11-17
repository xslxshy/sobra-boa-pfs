"use client";
import { useEffect, useState } from "react";
import { requisicao } from "../../lib/requisicao";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const mensagem = new URLSearchParams(window.location.search).get("erro");
    if (mensagem) setErro(mensagem);
  }, []);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    try {
      const dados = await requisicao("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });
      localStorage.setItem("token", dados.token);
      localStorage.setItem("usuario", JSON.stringify(dados.usuario));
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
        <div>
          <label>Senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        {erro && <p className="mensagem erro">{erro}</p>}
        <button className="botao">Entrar</button>
      </form>
      <h3>Contas de teste (senha 123456)</h3>
      <p>padaria@teste.com (doador)</p>
      <p>ong@teste.com (receptor)</p>
      <p>voluntario@teste.com (voluntário)</p>
    </main>
  );
}
