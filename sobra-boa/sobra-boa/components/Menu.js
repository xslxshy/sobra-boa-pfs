"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Menu() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    setUsuario(JSON.parse(localStorage.getItem("usuario") || "null"));
  }, []);

  function sair() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <header className="menu">
      <Link href="/" className="logo">Sobra Boa</Link>
      <nav>
        <Link href="/ofertas">Ofertas</Link>
        {usuario ? (
          <>
            <Link href="/painel">Meu painel</Link>
            <button onClick={sair}>Sair ({usuario.nome})</button>
          </>
        ) : (
          <>
            <Link href="/login">Entrar</Link>
            <Link href="/cadastro">Cadastrar</Link>
          </>
        )}
      </nav>
    </header>
  );
}
