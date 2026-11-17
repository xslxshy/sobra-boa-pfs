import { DataTypes } from "sequelize";
import { sequelize } from "../lib/database";

export const Oferta = sequelize.define("Oferta", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Informe o nome do alimento." },
      len: { args: [3, 100], msg: "O nome do alimento deve ter entre 3 e 100 caracteres." }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    defaultValue: ""
  },
  quantidade: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: { msg: "Informe a quantidade." },
      min: { args: [0.01], msg: "A quantidade deve ser maior que zero." }
    }
  },
  unidade: {
    type: DataTypes.ENUM("kg", "un", "porções", "L"),
    defaultValue: "un",
    validate: {
      isIn: { args: [["kg", "un", "porções", "L"]], msg: "Unidade inválida." }
    }
  },
  validade: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: "Informe a validade." },
      isDate: { msg: "Validade inválida." },
      ehFutura(valor) {
        if (this.isNewRecord && new Date(valor).getTime() <= Date.now()) {
          throw new Error("A validade precisa ser no futuro.");
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM("disponivel", "reservada", "entregue", "cancelada"),
    defaultValue: "disponivel"
  },
  precisaVoluntario: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rua: DataTypes.STRING,
  numero: DataTypes.STRING,
  bairro: DataTypes.STRING,
  cidade: DataTypes.STRING
});
