import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const createOrder = (req: Request, res: Response, next: NextFunction) => {
  const {
    total, items,
  } = req.body;

  return Product.find({ _id: { $in: items } })
    .then((products) => {
      if (products.length !== new Set(items).size) {
        return next(new BadRequestError('Товар не найден'));
      }
      if (products.some((product) => product.price === null)) {
        return next(new BadRequestError('Товар не продаётся'));
      }
      const sum = products.reduce(
        (acc, product) => acc + (product.price ?? 0),
        0,
      );
      if (sum !== total) {
        return next(new BadRequestError('Неверная сумма заказа'));
      }

      return res.send({ id: faker.string.uuid(), total });
    })
    .catch(next);
};

export default createOrder;
