"use client";
import { useEffect, useState } from "react";
import CartaoOferta from "./CartaoOferta";
import { enviarAcao } from "../lib/acoes";
import { requisicao } from "../lib/requisicao";

const vazio = { titulo: "", descricao: "", quantidade: "", unidade: "kg", validade: "" };

export default function PainelDoador({ usuario }) {
  const [form, setForm] = useState(vazio);
  const [ofertas, setOfertas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    try {
      setOfertas(await requisicao(`/api/ofertas?doadorId=${usuario.id}`));
    } catch (e) {
      setMensagem(e.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function publicar(e) {
    e.preventDefault();
    setMensagem("");
    try {
      await requisicao("/api/ofertas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, doadorId: usuario.id })
      });
      setForm(vazio);
      setMensagem("Alimento publicado!");
      carregar();
    } catch (e) {
      setMensagem(e.message);
    }
  }

  async function cancelar(id) {
    try {
      await enviarAcao(id, "cancelar", usuario.id);
      carregar();
    } catch (e) {
      setMensagem(e.message);
    }
  }

  async function excluir(id) {
    try {
      await requisicao(`/api/ofertas/${id}?usuarioId=${usuario.id}`, { method: "DELETE" });
      carregar();
    } catch (e) {
      setMensagem(e.message);
    }
  }

  return (
    <div>
      <h2>Publicar alimento</h2>
      <form onSubmit={publicar}>
        <div>
          <label>Alimento</label>
          <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
        </div>
        <div>
          <label>Quantidade</label>
          <input type="number" min="1" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} required />
        </div>
        <div>
          <label>Unidade</label>
          <select value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })}>
            <option>kg</option>
            <option>un</option>
            <option>porções</option>
            <option>L</option>
          </select>
        </div>
        <div>
          <label>Pode ser consumido até</label>
          <input type="datetime-local" value={form.validade} onChange={(e) => setForm({ ...form, validade: e.target.value })} required />
        </div>
        <div>
          <label>Detalhes (opcional)</label>
          <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        </div>
        <button className="botao">Publicar</button>
      </form>
      {mensagem && <p className="mensagem">{mensagem}</p>}

      <h2>Meus alimentos</h2>
      {ofertas.length === 0 ? (
        <p className="vazio">Você ainda não publicou nada.</p>
      ) : (
        <div className="lista">
          {ofertas.map((o) => (
            <CartaoOferta key={o.id} oferta={o} usuario={usuario}>
              {(o.status === "disponivel" || o.status === "reservada") && (
                <button className="botao vermelho" onClick={() => cancelar(o.id)}>Cancelar</button>
              )}
              {["disponivel", "vencida", "cancelada"].includes(o.status) && (
                <button className="botao cinza" onClick={() => excluir(o.id)}>Excluir</button>
              )}
            </CartaoOferta>
          ))}
        </div>
      )}
    </div>
  );
}
