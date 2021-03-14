import { Router } from "express";
import CategoryService from "../services/CategoryService";

const routes = Router();

routes.get("/", async (req, res) => {
  const categoryList = await CategoryService.readAll();
  res.status(200).send(categoryList);
});

routes.get("/:id", async (req, res) => {
  const { id: ID } = req.params;
  const category = await CategoryService.readByID(ID);
  res.status(200).send(category);
});

routes.post("/", async (req, res) => {
  const { name } = req.body;
  const newCategory = await CategoryService.create({ name });
  res.status(201).send(newCategory);
});

routes.put("/:id", async (req, res) => {
  const { id: ID } = req.params;
  const { name } = req.body;
  const category = await CategoryService.updateByID(ID, { name });
  res.status(200).send(category);
});

routes.delete("/:id", async (req, res) => {
  const { id: ID } = req.params;
  const category = await CategoryService.deleteByID(ID);
  res.status(200).send(category);
});

export default routes;
