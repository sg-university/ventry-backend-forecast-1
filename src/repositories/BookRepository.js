import postgresDB from "../dao/PostgresDB";
import Debugger from "../tools/Debugger";
import PostgresDB from "../dao/PostgresDB";
import { v4 as uuidv4 } from "uuid";
import Book from "../models/Book";

class BookService {
  async create(book) {
    const newBook = {
      ID: uuidv4(),
      name: book.name,
      description: book.description,
      stock: book.stock,
      image: book.image,
      categoryID: book.categoryID,
    };

    try {
      const sql =
        "insert into books(id, name, description, stock, image, category_id) values ($1, $2, $3, $4, $5, $6)";
      const res = await PostgresDB.pool.query(sql, [
        newBook.ID,
        newBook.name,
        newBook.description,
        newBook.stock,
        newBook.image,
        newBook.categoryID,
      ]);
      Debugger.log("BookService", "Create succeed");
      return newBook;
    } catch (err) {
      Debugger.error("BookService", `Create failed ${err}`);
    }
  }

  async readAll() {
    try {
      const sql =
        "select id, name, description, stock, image, category_id from books";
      const res = await PostgresDB.pool.query(sql);
      Debugger.log("BookService", "Read all succeed");
      return res.rows;
    } catch (err) {
      Debugger.error("BookService", `Read all failed ${err}`);
    }
  }

  async readByID(ID) {
    try {
      const sql =
        "select id, name, description, stock, image, category_id from books where id=$1";
      const res = await PostgresDB.pool.query(sql, [ID]);
      Debugger.log("BookService", "Read by ID succeed");
      return res.rows[0];
    } catch (err) {
      Debugger.error("BookService", `Read by ID failed ${err}`);
    }
  }

  async updateByID(ID, bookToUpdate) {
    const updateBook = {
      ID: ID,
      name: bookToUpdate.name,
      description: bookToUpdate.description,
      stock: bookToUpdate.stock,
      image: bookToUpdate.image,
      categoryID: bookToUpdate.categoryID,
    };
    try {
      const sql =
        "update books set name=$1, description=$2, stock=$3, image=$4, category_id=$5 where id=$6 returning *";
      const res = await PostgresDB.pool.query(sql, [
        updateBook.name,
        updateBook.description,
        updateBook.stock,
        updateBook.image,
        updateBook.categoryID,
        updateBook.ID,
      ]);
      Debugger.log("BookService", "Update by ID succeed");
      return res.rows[0];
    } catch (err) {
      Debugger.error("BookService", `Update by ID failed ${err}`);
    }
  }

  async deleteByID(ID) {
    try {
      const sql = "delete from books where id=$1 returning *";
      const res = await PostgresDB.pool.query(sql, [ID]);
      Debugger.log("BookService", "Delete by ID succeed");
      return res.rows[0];
    } catch (err) {
      Debugger.error("BookService", `Delete by ID failed ${err}`);
    }
  }
}

export default new BookService();
