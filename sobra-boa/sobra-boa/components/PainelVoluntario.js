"use client";
import { useEffect, useState } from "react";
import CartaoOferta from "./CartaoOferta";
import { enviarAcao } from "../lib/acoes";
import { requisicao } from "../lib/requisicao";

export default function PainelVoluntario({ usuario }) {
  const [pendentes, setPendentes] = useState([]);
  const [minhas, setMinhas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  //carrega as ofertas do usuário
  async function carregar() {
    try {
      const reservadas = await requisicao("/api/ofertas?status=reservada&precisaVoluntario=true&semVoluntario=true");
      setPendentes(reservadas);
      setMinhas(await requisicao(`/api/usuarios/${usuario.id}/ofertas`));
    } catch (e) {
      setMensagem(e.message);
    }
  }

  //carrega as ofertas do usuário
  useEffect(() => {
    carregar();
  }, []);

  //função para confirmar o recebimento de uma oferta
  async function agir(id, acao) {
    try {
      await enviarAcao(id, acao);
      carregar();
    } catch (e) {
      setMensagem(e.message);
    }
  }

  return (
    <div>
      {mensagem && <p className="mensagem erro">{mensagem}</p>}
      <h2>Minhas coletas</h2>
      {minhas.length === 0 ? (
        <p className="vazio">Você ainda nao aceitou nenhuma coleta</p>
      ) : (
        <div className="lista">
          {minhas.map((o) => (
            <CartaoOferta key={o.id} oferta={o} usuario={usuario}>
              {o.status === "reservada" && (
                <button className="botao" onClick={() => agir(o.id, "entregar")}>Confirmar entrega</button>
              )}
            </CartaoOferta>
          ))}
        </div>
      )}

      <h2>Coletas que precisam de voluntário</h2>
      {pendentes.length === 0 ? (
        <p className="vazio">Nenhuma coleta pendente agora</p>
      ) : (
        <div className="lista">
          {pendentes.map((o) => (
            <CartaoOferta key={o.id} oferta={o} usuario={usuario}>
              <button className="botao amarelo" onClick={() => agir(o.id, "aceitar")}>Aceitar coleta</button>
            </CartaoOferta>
          ))}
        </div>
      )}
    </div>
  );
}
