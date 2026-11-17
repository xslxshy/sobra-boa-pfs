"use client";
import { useEffect, useState } from "react";
import PainelDoador from "../../components/PainelDoador";
import PainelReceptor from "../../components/PainelReceptor";
import PainelVoluntario from "../../components/PainelVoluntario";

export default function Painel() {
  const [usuario, setUsuario] = useState(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const salvo = JSON.parse(localStorage.getItem("usuario") || "null");
    if (!salvo || !localStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }
    setUsuario(salvo);
    setCarregado(true);
  }, []);

  if (!carregado) return <main><p>Carregando...</p></main>;

  return (
    <main>
      <h1>Olá, {usuario.nome}</h1>
      {usuario.perfil === "doador" && <PainelDoador usuario={usuario} />}
      {usuario.perfil === "receptor" && <PainelReceptor usuario={usuario} />}
      {usuario.perfil === "voluntario" && <PainelVoluntario usuario={usuario} />}
    </main>
  );
}
