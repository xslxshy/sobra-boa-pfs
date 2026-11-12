"use client";
import { useEffect, useState } from "react";
import CartaoOferta from "./CartaoOferta";
import { enviarAcao } from "../lib/acoes";
import { requisicao } from "../lib/requisicao";

export default function PainelReceptor({ usuario }) {
  const [ofertas, setOfertas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    try {
      setOfertas(await requisicao(`/api/ofertas?receptorId=${usuario.id}`));
    } catch (e) {
      setMensagem(e.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function confirmar(id) {
    try {
      await enviarAcao(id, "entregar", usuario.id);
      carregar();
    } catch (e) {
      setMensagem(e.message);
    }
  }

  return (
    <div>
      <h2>Minhas reservas</h2>
      {mensagem && <p className="mensagem erro">{mensagem}</p>}
      {ofertas.length === 0 ? (
        <p className="vazio">Você ainda não reservou nada, veja a página Ofertas</p>
      ) : (
        <div className="lista">
          {ofertas.map((o) => (
            <CartaoOferta key={o.id} oferta={o} usuario={usuario}>
              {o.status === "reservada" && !o.precisaVoluntario && (
                <button className="botao" onClick={() => confirmar(o.id)}>Confirmar recebimento</button>
              )}
              {o.status === "reservada" && o.precisaVoluntario && !o.voluntarioId && (
                <p>Aguardando um voluntário aceitar a coleta</p>
              )}
            </CartaoOferta>
          ))}
        </div>
      )}
    </div>
  );
}
