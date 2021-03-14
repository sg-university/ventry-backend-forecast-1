import postgresDB from "../dao/PostgresDB";
import Debugger from "../tools/Debugger";
import PostgresDB from "../dao/PostgresDB";
import { v4 as uuidv4 } from "uuid";
import Book from "../models/Book";

class CustomBookRepository {
  async readAllWithCategory() {
    try {
      const sql =
        "select b.id as book_id, c.id as category_id, b.name as book_name, c.name as category_name, b.description as book_description, b.stock as book_stock, b.image as book_image from books b inner join categories c on c.id=b.category_id";
      const res = await PostgresDB.pool.query(sql);
      Debugger.log("CustomBookRepository", "Read all with category succeed");
      return res.rows;
    } catch (err) {
      Debugger.error(
        "CustomBookRepository",
        `Read all with category failed ${err}`
      );
    }
  }

  async readWithCategoryByID(ID) {
    try {
      const sql =
        "select b.id as book_id, c.id as category_id, b.name as book_name, c.name as category_name, b.description as book_description, b.stock as book_stock, b.image as book_image from books b inner join categories c on c.id=b.category_id where b.id=$1";
      const res = await PostgresDB.pool.query(sql, [ID]);
      Debugger.log("CustomBookRepository", "Read with category by ID succeed");
      return res.rows[0];
    } catch (err) {
      Debugger.error(
        "CustomBookRepository",
        `Read with category by ID failed ${err}`
      );
    }
  }
}

export default new CustomBookRepository();
