import { Pool } from "pg";
import Debugger from "../tools/Debugger";
import dotenv from "dotenv";
dotenv.config();

class PostgresDB {
  pool = new Pool({
    user: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT,
    database: process.env.DB_POSTGRES_DATABASE,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  });

  connect() {
    this.pool.connect((err, client, release) => {
      if (err) {
        return Debugger.log("PostgresDB", `Initial connection failed ${err}`);
      }
      client.query("SELECT NOW()", (err, result) => {
        release();
        if (err) {
          return Debugger.log("PostgresDB", `Error executing query ${err}`);
        }
        Debugger.log("PostgresDB", `Initial connection succeed`);
        Debugger.log("PostgresDB", result.rows);
      });
    });
  }
}

export default new PostgresDB();
