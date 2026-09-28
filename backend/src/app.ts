import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productsRouter from "./routes/products";
import path from "path";
import ordersRouter from "./routes/orders";
import NotFoundError from "./errors/not-found-error";
import { errors } from "celebrate";
import errorHandler from "./middlewares/error-handler";
import { errorLogger, requestLogger } from "./middlewares/logger";

const { PORT = 3000, DB_ADDRESS = "mongodb://127.0.0.1:27017/weblarek" } =
  process.env;

const app = express();

mongoose.connect(DB_ADDRESS);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(requestLogger);

app.use("/product", productsRouter);
app.use("/order", ordersRouter);

app.use((_req, _res, next) => {
  next(new NotFoundError("Маршрут не найден"));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
