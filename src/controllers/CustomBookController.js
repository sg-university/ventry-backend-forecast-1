import { Router } from "express";
import CustomBookService from "../services/CustomBookService";

const routes = Router();

routes.get("/", async (req, res) => {
  const bookList = await CustomBookService.readAllWithCategory();
  res.status(200).send(bookList);
});

routes.get("/:id", async (req, res) => {
  const { id: ID } = req.params;
  const book = await CustomBookService.readWithCategoryByID(ID);
  res.status(200).send(book);
});

export default routes;
