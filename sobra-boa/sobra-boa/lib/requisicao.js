export async function requisicao(url, opcoes) {
  const token = localStorage.getItem("token");
  const headers = { ...(opcoes && opcoes.headers) };
  if (token) headers.Authorization = `Bearer ${token}`;

  let resposta;
  try {
    resposta = await fetch(url, { ...opcoes, headers });
  } catch {
    throw new Error("Não foi possível falar com o servidor. Confira se o npm run dev está rodando no terminal.");
  }

  let dados = null;
  try {
    dados = await resposta.json();
  } catch {
    dados = null;
  }

  if (!resposta.ok) {
    const mensagem = (dados && dados.erro) || `Erro no servidor (código ${resposta.status}). Veja a mensagem no terminal do VSCode.`;
    if (resposta.status === 401 && token && url !== "/api/auth/login") {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = `/login?erro=${encodeURIComponent(mensagem)}`;
    }
    throw new Error(mensagem);
  }
  return dados;
}
