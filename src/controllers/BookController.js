import { Router } from "express";
import BookService from "../services/BookService";

const routes = Router();

routes.get("/", async (req, res) => {
  const bookList = await BookService.readAll();
  res.status(200).send(bookList);
});

routes.get("/:id", async (req, res) => {
  const { id: ID } = req.params;
  const book = await BookService.readByID(ID);
  res.status(200).send(book);
});

routes.post("/", async (req, res) => {
  const { name, description, stock, image, category_id: categoryID } = req.body;
  const newBook = await BookService.create({
    name,
    description,
    stock,
    image,
    categoryID,
  });
  res.status(201).send(newBook);
});

routes.put("/:id", async (req, res) => {
  const { id: ID } = req.params;
  const { name, description, stock, image, category_id: categoryID } = req.body;
  const book = await BookService.updateByID(ID, {
    name,
    description,
    stock,
    image,
    categoryID,
  });
  res.status(200).send(book);
});

routes.delete("/:id", async (req, res) => {
  const { id: ID } = req.params;
  const book = await BookService.deleteByID(ID);
  res.status(200).send(book);
});

export default routes;
