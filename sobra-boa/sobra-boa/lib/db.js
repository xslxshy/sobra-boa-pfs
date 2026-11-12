import fs from "fs";
import path from "path";

const pasta = path.join(process.cwd(), "data");
const arquivo = path.join(pasta, "db.json");

const inicial = {
  usuarios: [
    { id: 1, nome: "Marta", email: "padaria@teste.com", perfil: "doador", telefone: "(32) 99999-0001", cep: "36010000", rua: "Av. Rio Branco", numero: "100", bairro: "Centro", cidade: "Juiz de Fora" },
    { id: 2, nome: "Ana", email: "ong@teste.com", perfil: "receptor", telefone: "(32) 99999-0002", cep: "36010000", rua: "Rua Halfeld", numero: "50", bairro: "Centro", cidade: "Juiz de Fora" },
    { id: 3, nome: "Carlos", email: "voluntario@teste.com", perfil: "voluntario", telefone: "(32) 99999-0003", cep: "36010000", rua: "Rua Batista de Oliveira", numero: "20", bairro: "Centro", cidade: "Juiz de Fora" }
  ],
  ofertas: []
};

export function lerBanco() {
  if (!fs.existsSync(arquivo)) {
    fs.mkdirSync(pasta, { recursive: true });
    fs.writeFileSync(arquivo, JSON.stringify(inicial, null, 2));
  }
  return JSON.parse(fs.readFileSync(arquivo, "utf8"));
}

export function salvarBanco(db) {
  fs.writeFileSync(arquivo, JSON.stringify(db, null, 2));
}
