import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "mysql",
  host: process.env.database_host,
  port: +process.env.database_port!,
  username: process.env.database_username,
  password: process.env.database_password,
  database: process.env.database_database,
  entities: ["./src/db/entities/*.ts"],
  migrations: ["./src/db/migrations/*.ts"],
  synchronize: true,
});
