import bcrypt from "bcryptjs";
import { sequelize } from "../lib/database";
import { Usuario } from "./Usuario";
import { Oferta } from "./Oferta";

Usuario.hasMany(Oferta, { as: "ofertasDoadas", foreignKey: "doadorId" });
Oferta.belongsTo(Usuario, { as: "doador", foreignKey: "doadorId" });

Usuario.hasMany(Oferta, { as: "reservas", foreignKey: "receptorId" });
Oferta.belongsTo(Usuario, { as: "receptor", foreignKey: "receptorId" });

Usuario.hasMany(Oferta, { as: "coletas", foreignKey: "voluntarioId" });
Oferta.belongsTo(Usuario, { as: "voluntario", foreignKey: "voluntarioId" });

export { Usuario, Oferta };

export function iniciarBanco() {
  if (!globalThis.bancoPronto) {
    globalThis.bancoPronto = (async () => {
      await sequelize.sync();
      if ((await Usuario.count()) === 0) {
        const senhaHash = bcrypt.hashSync("123456", 10);
        const endereco = { cep: "36010000", bairro: "Centro", cidade: "Juiz de Fora" };
        await Usuario.create({ nome: "Marta", email: "padaria@teste.com", perfil: "doador", telefone: "(32) 99999-0001", rua: "Av. Rio Branco", numero: "100", senhaHash, ...endereco });
        await Usuario.create({ nome: "Ana", email: "ong@teste.com", perfil: "receptor", telefone: "(32) 99999-0002", rua: "Rua Halfeld", numero: "50", senhaHash, ...endereco });
        await Usuario.create({ nome: "Carlos", email: "voluntario@teste.com", perfil: "voluntario", telefone: "(32) 99999-0003", rua: "Rua Batista de Oliveira", numero: "20", senhaHash, ...endereco });
      }
    })().catch((erro) => {
      globalThis.bancoPronto = null;
      throw erro;
    });
  }
  return globalThis.bancoPronto;
}
