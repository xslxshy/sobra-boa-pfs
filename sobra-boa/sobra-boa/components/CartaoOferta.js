function tempoRestante(validade) {
  const minutos = Math.floor((new Date(validade).getTime() - Date.now()) / 60000);
  if (minutos <= 0) return { texto: "Vencido", classe: "" };
  const dias = Math.floor(minutos / 1440);
  const horas = Math.floor((minutos % 1440) / 60);
  const min = minutos % 60;
  let texto = `${min}min`;
  if (horas > 0) texto = `${horas}h ${min}min`;
  if (dias > 0) texto = `${dias}d ${horas}h`;
  let classe = "";
  if (minutos < 180) classe = "urgente";
  else if (minutos < 1440) classe = "medio";
  return { texto: `Vence em ${texto}`, classe };
}

export default function CartaoOferta({ oferta, usuario, children }) {
  const tempo = tempoRestante(oferta.validade);
  const mesmoBairro = usuario && usuario.bairro === oferta.bairro && usuario.cidade === oferta.cidade;
  const mesmaCidade = usuario && usuario.cidade === oferta.cidade;

  return (
    <div className="cartao">
      {oferta.status === "disponivel" || oferta.status === "reservada" ? (
        <span className={`tempo ${tempo.classe}`}>{tempo.texto}</span>
      ) : (
        <span className="tempo">{oferta.status}</span>
      )}
      <h3>{oferta.titulo}</h3>
      <p><b>{oferta.quantidade} {oferta.unidade}</b></p>
      {oferta.descricao && <p>{oferta.descricao}</p>}
      <p>Doador: {oferta.doadorNome}</p>
      <p>Local: {oferta.bairro}, {oferta.cidade}</p>
      {mesmoBairro && <p><b>Está no seu bairro</b></p>}
      {!mesmoBairro && mesmaCidade && <p>Está na sua cidade</p>}
      {oferta.receptorNome && <p>Receptor: {oferta.receptorNome}</p>}
      {oferta.voluntarioNome && <p>Voluntário: {oferta.voluntarioNome}</p>}
      {children && <div className="acoes">{children}</div>}
    </div>
  );
}
