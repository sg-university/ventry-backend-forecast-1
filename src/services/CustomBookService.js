import postgresDB from "../dao/PostgresDB";
import Debugger from "../tools/Debugger";
import PostgresDB from "../dao/PostgresDB";
import { v4 as uuidv4 } from "uuid";
import Book from "../models/Book";
import BookRepository from "../repositories/BookRepository";
import CustomBookRepository from "../repositories/CustomBookRepository";

class BookService {
  async readAllWithCategory() {
    return await CustomBookRepository.readAllWithCategory();
  }

  async readWithCategoryByID(ID) {
    return await CustomBookRepository.readWithCategoryByID(ID);
  }
}

export default new BookService();
