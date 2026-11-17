import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import sqlite3 from "sqlite3";

const pasta = path.join(process.cwd(), "data");
fs.mkdirSync(pasta, { recursive: true });

if (!globalThis.conexao) {
  globalThis.conexao = new Sequelize({
    dialect: "sqlite",
    dialectModule: sqlite3,
    storage: path.join(pasta, "db.sqlite"),
    logging: false
  });
}

export const sequelize = globalThis.conexao;
