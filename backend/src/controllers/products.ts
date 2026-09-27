import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getAllProducts = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => product
  .find({})
  .then((products) => res.send({ items: products, total: products.length }))
  .catch(next);

export const createNewProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    title, image, category, description, price,
  } = req.body;

  return product
    .create({
      title,
      image,
      category,
      description,
      price,
    })
    .then((createdProduct) => res.status(201).send(createdProduct))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(
          new BadRequestError('Ошибка валидации данных при создании товара'),
        );
      }
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(
          new ConflictError('Товар с таким названием уже существует'),
        );
      }
      return next(error);
    });
};
