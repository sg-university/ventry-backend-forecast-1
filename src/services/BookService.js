import postgresDB from "../dao/PostgresDB";
import Debugger from "../tools/Debugger";
import PostgresDB from "../dao/PostgresDB";
import { v4 as uuidv4 } from "uuid";
import Book from "../models/Book";
import BookRepository from "../repositories/BookRepository";
import CustomBookRepository from "../repositories/CustomBookRepository";

class BookService {
  async create(book) {
    return await BookRepository.create(book);
  }

  async readAll() {
    return await BookRepository.readAll();
  }

  async readAllWithCategory() {
    return await CustomBookRepository.readWithCategory();
  }

  async readByID(ID) {
    return await BookRepository.readByID(ID);
  }

  async updateByID(ID, bookToUpdate) {
    return await BookRepository.updateByID(ID, bookToUpdate);
  }

  async deleteByID(ID) {
    return await BookRepository.deleteByID(ID);
  }
}

export default new BookService();
