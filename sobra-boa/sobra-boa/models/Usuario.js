import { DataTypes } from "sequelize";
import { sequelize } from "../lib/database";

export const Usuario = sequelize.define("Usuario", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Informe o nome." },
      len: { args: [2, 100], msg: "O nome deve ter entre 2 e 100 caracteres." }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: "Informe o e-mail." },
      isEmail: { msg: "E-mail inválido." }
    }
  },
  senhaHash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Informe a senha." }
    }
  },
  perfil: {
    type: DataTypes.ENUM("doador", "receptor", "voluntario"),
    allowNull: false,
    validate: {
      notNull: { msg: "Escolha um perfil." },
      isIn: { args: [["doador", "receptor", "voluntario"]], msg: "Perfil inválido." }
    }
  },
  telefone: DataTypes.STRING,
  cep: DataTypes.STRING,
  rua: DataTypes.STRING,
  numero: DataTypes.STRING,
  bairro: DataTypes.STRING,
  cidade: DataTypes.STRING
});
