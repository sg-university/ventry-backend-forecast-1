import postgresDB from "../dao/PostgresDB";
import Debugger from "../tools/Debugger";
import PostgresDB from "../dao/PostgresDB";
import { v4 as uuidv4 } from "uuid";
import Category from "../models/Category";

class CategoryService {
  async create(category) {
    const newCategory = { ID: uuidv4(), name: category.name };

    try {
      const sql = "insert into categories(id, name) values ($1, $2)";
      const res = await PostgresDB.pool.query(sql, [
        newCategory.ID,
        newCategory.name,
      ]);
      Debugger.log("CategoryService", "Create succeed");
      return newCategory;
    } catch (err) {
      Debugger.error("CategoryService", `Create failed ${err}`);
    }
  }

  async readAll() {
    try {
      const sql = "select id, name from categories";
      const res = await PostgresDB.pool.query(sql);
      Debugger.log("CategoryService", "Read all succeed");
      return res.rows;
    } catch (err) {
      Debugger.error("CategoryService", `Read all failed ${err}`);
    }
  }

  async readByID(ID) {
    try {
      const sql = "select id, name from categories where id=$1";
      const res = await PostgresDB.pool.query(sql, [ID]);
      Debugger.log("CategoryService", "Read by ID succeed");
      return res.rows[0];
    } catch (err) {
      Debugger.error("CategoryService", `Read by ID failed ${err}`);
    }
  }

  async updateByID(ID, categoryToUpdate) {
    const updateCategory = { ID: ID, name: categoryToUpdate.name };

    try {
      const sql = "update categories set name=$1 where id=$2 returning *";
      const res = await PostgresDB.pool.query(sql, [
        updateCategory.name,
        updateCategory.ID,
      ]);
      Debugger.log("CategoryService", "Update by ID succeed");
      return res.rows[0];
    } catch (err) {
      Debugger.error("CategoryService", `Update by ID failed ${err}`);
    }
  }

  async deleteByID(ID) {
    try {
      const sql = "delete from categories where id=$1 returning *";
      const res = await PostgresDB.pool.query(sql, [ID]);
      Debugger.log("CategoryService", "Delete by ID succeed");
      return res.rows[0];
    } catch (err) {
      Debugger.error("CategoryService", `Delete by ID failed ${err}`);
    }
  }
}

export default new CategoryService();
