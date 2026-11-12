"use client";
import { useState } from "react";
import { requisicao } from "../../lib/requisicao";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "", email: "", perfil: "doador", telefone: "",
    cep: "", rua: "", numero: "", bairro: "", cidade: ""
  });
  const [erro, setErro] = useState("");

  function mudar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  async function buscarCep() {
    setErro("");
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      setErro("O CEP deve ter 8 números");
      return;
    }
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resposta.json();
      if (dados.erro) {
        setErro("CEP não encontrado");
        return;
      }
      setForm({ ...form, cep, rua: dados.logradouro, bairro: dados.bairro, cidade: dados.localidade });
    } catch {
      setErro("Não foi possível consultar o cep");
    }
  }

  async function cadastrar(e) {
    e.preventDefault();
    setErro("");
    try {
      const dados = await requisicao("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      localStorage.setItem("usuario", JSON.stringify(dados));
      window.location.href = "/painel";
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <main>
      <h1>Cadastro</h1>
      <form onSubmit={cadastrar}>
        <div>
          <label>Perfil</label>
          <select value={form.perfil} onChange={(e) => mudar("perfil", e.target.value)}>
            <option value="doador">Doador (mercado, padaria, restaurante, produtor)</option>
            <option value="receptor">Receptor (ONG, abrigo, cozinha comunitária)</option>
            <option value="voluntario">Voluntário (transporte)</option>
          </select>
        </div>
        <div>
          <label>Nome</label>
          <input value={form.nome} onChange={(e) => mudar("nome", e.target.value)} required />
        </div>
        <div>
          <label>E-mail</label>
          <input type="email" value={form.email} onChange={(e) => mudar("email", e.target.value)} required />
        </div>
        <div>
          <label>Telefone</label>
          <input value={form.telefone} onChange={(e) => mudar("telefone", e.target.value)} />
        </div>
        <div>
          <label>CEP</label>
          <input value={form.cep} onChange={(e) => mudar("cep", e.target.value)} placeholder="36010000" required />
        </div>
        <button type="button" className="botao cinza" onClick={buscarCep}>Buscar endereço pelo CEP</button>
        <div>
          <label>Rua</label>
          <input value={form.rua} readOnly />
        </div>
        <div>
          <label>Número</label>
          <input value={form.numero} onChange={(e) => mudar("numero", e.target.value)} />
        </div>
        <div>
          <label>Bairro</label>
          <input value={form.bairro} readOnly />
        </div>
        <div>
          <label>Cidade</label>
          <input value={form.cidade} readOnly />
        </div>
        {erro && <p className="mensagem erro">{erro}</p>}
        <button className="botao">Criar conta</button>
      </form>
    </main>
  );
}
