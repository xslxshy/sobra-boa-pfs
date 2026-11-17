"use client";
import { useEffect, useState } from "react";
import CartaoOferta from "../../components/CartaoOferta";
import { enviarAcao } from "../../lib/acoes";
import { requisicao } from "../../lib/requisicao";

export default function Ofertas() {
  const [usuario, setUsuario] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [cidade, setCidade] = useState("");
  const [precisaVoluntario, setPrecisaVoluntario] = useState(true);
  const [mensagem, setMensagem] = useState("");

  //chama requisicao.js
  async function carregar() {
    try {
      setOfertas(await requisicao(`/api/ofertas?status=disponivel&cidade=${cidade}`));
    } catch (e) {
      setMensagem(e.message);
    }
  }

  //carrega o usuario do localStorage
  useEffect(() => {
    setUsuario(JSON.parse(localStorage.getItem("usuario") || "null"));
  }, []);

  //carrega as ofertas quando a cidade mudar
  useEffect(() => {
    carregar();
  }, [cidade]);

  //reserva a oferta chamando enviarAcao
  async function reservar(id) {
    setMensagem("");
    try {
      await enviarAcao(id, "reservar", precisaVoluntario);
      setMensagem("Reserva feita! Veja em Meu painel.");
      carregar();
    } catch (e) {
      setMensagem(e.message);
    }
  }

  return (
    <main>
      <h1>Alimentos disponíveis</h1>
      <p>Os que vencem primeiro aparecem no topo.</p>
      <div className="filtro">
        <div>
          <label>Filtrar por cidade</label>
          <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex.: Juiz de Fora" />
        </div>
        {usuario && usuario.perfil === "receptor" && (
          <label>
            <input type="checkbox" style={{ width: "auto" }} checked={precisaVoluntario} onChange={(e) => setPrecisaVoluntario(e.target.checked)} />
            {" "}Preciso de voluntário para buscar
          </label>
        )}
      </div>
      {mensagem && <p className="mensagem">{mensagem}</p>}
      {ofertas.length === 0 ? (
        <p className="vazio">Nenhum alimento disponível no momento.</p>
      ) : (
        <div className="lista">
          {ofertas.map((o) => (
            <CartaoOferta key={o.id} oferta={o} usuario={usuario}>
              {usuario && usuario.perfil === "receptor" && (
                <button className="botao" onClick={() => reservar(o.id)}>Reservar</button>
              )}
            </CartaoOferta>
          ))}
        </div>
      )}
    </main>
  );
}
