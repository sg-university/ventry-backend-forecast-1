import postgresDB from "../dao/PostgresDB";
import Debugger from "../tools/Debugger";
import PostgresDB from "../dao/PostgresDB";
import { v4 as uuidv4 } from "uuid";
import Category from "../models/Category";
import CategoryRepository from "../repositories/CategoryRepository";

class CategoryService {
  async create(category) {
    return await CategoryRepository.create(category);
  }

  async readAll() {
    return await CategoryRepository.readAll();
  }

  async readByID(ID) {
    return await CategoryRepository.readByID(ID);
  }

  async updateByID(ID, categoryToUpdate) {
    return await CategoryRepository.updateByID(ID, categoryToUpdate);
  }

  async deleteByID(ID) {
    return await CategoryRepository.deleteByID(ID);
  }
}

export default new CategoryService();
