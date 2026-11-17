export function pegarCampos(dados, campos) {
  const resultado = {};
  for (const campo of campos) {
    if (dados[campo] !== undefined) resultado[campo] = dados[campo];
  }
  return resultado;
}

export function usuarioPublico(usuario) {
  const { id, nome, email, perfil, telefone, cep, rua, numero, bairro, cidade } = usuario;
  return { id, nome, email, perfil, telefone, cep, rua, numero, bairro, cidade };
}

export function ofertaParaJson(oferta) {
  const o = oferta.get({ plain: true });
  const vencida = o.status === "disponivel" && new Date(o.validade).getTime() < Date.now();
  return {
    id: o.id,
    titulo: o.titulo,
    descricao: o.descricao,
    quantidade: o.quantidade,
    unidade: o.unidade,
    validade: o.validade,
    rua: o.rua,
    numero: o.numero,
    bairro: o.bairro,
    cidade: o.cidade,
    status: vencida ? "vencida" : o.status,
    precisaVoluntario: o.precisaVoluntario,
    doadorId: o.doadorId,
    receptorId: o.receptorId,
    voluntarioId: o.voluntarioId,
    doadorNome: o.doador ? o.doador.nome : null,
    receptorNome: o.receptor ? o.receptor.nome : null,
    voluntarioNome: o.voluntario ? o.voluntario.nome : null
  };
}
