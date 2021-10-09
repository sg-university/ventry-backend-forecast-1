import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import routes from "./routes";
import PostgresDB from "./dao/PostgresDB";
import cors from "cors";

import { time } from "console";

const app = express();

PostgresDB.connect();

app.disable("x-powered-by");

// View engine setup
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "pug");

app.use(
  logger("dev", {
    skip: () => app.get("env") === "test",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.use(cors());
app.options("*", cors());

// Routes
app.use(routes);

// Catch 404 then forward to error handler
app.use((req, res, next) => {
  // force to 404
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).render("error", {
    message: err.message,
  });
});

export default app;
