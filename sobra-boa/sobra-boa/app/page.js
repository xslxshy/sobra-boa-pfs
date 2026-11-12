import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Sobra Boa</h1>
        <p>
          A Sobra Boa conecta mercados, padarias e restaurantes que têm excedente de alimentos
          com ONGs, abrigos e cozinhas comunitárias, e chama voluntários para fazer o transporte.
          O que vence primeiro aparece primeiro.
        </p>
        <Link href="/ofertas" className="botao amarelo">Ver alimentos disponíveis</Link>
      </section>
      <main>
        <h2>Como funciona</h2>
        <div className="lista">
          <div className="cartao">
            <h3>Doador</h3>
            <p>Publica a sobra com quantidade e validade</p>
          </div>
          <div className="cartao">
            <h3>Receptor</h3>
            <p>Vê o que está por perto, do que vence mais cedo ao que demora mais pra vencer e reserva.</p>
          </div>
          <div className="cartao">
            <h3>Voluntário</h3>
            <p>Aceita a coleta e leva o alimento do doador até o receptor</p>
          </div>
        </div>
      </main>
    </>
  );
}
