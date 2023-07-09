import { Dialect, Sequelize } from "sequelize";

export let sequelize = new Sequelize("sqlite::memory:");

if (process.env.NODE_ENV !== "test") {
  const connString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  sequelize = new Sequelize(connString, {
    dialect: process.env.DB_DIALECT as Dialect,
  });
}
