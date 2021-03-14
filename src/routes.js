import { Router } from "express";
import CategoryController from "./controllers/CategoryController";
import BookController from "./controllers/BookController";
import CustomBookController from "./controllers/CustomBookController";
import TestController from "./controllers/TestController";

const routes = Router();

routes.use("/api/v1/categories", CategoryController);
routes.use("/api/v1/books", BookController);
routes.use("/api/v1/books-custom", CustomBookController);
routes.use("/api/v1/test", TestController);

export default routes;
