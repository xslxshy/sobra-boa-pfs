import "./globals.css";
import Menu from "../components/Menu";

export const metadata = {
  title: "Sobra Boa",
  description: "Conecta quem tem excedente de alimentos a quem precisa."
};

export default function Layout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Menu />
        {children}
      </body>
    </html>
  );
}
