import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import validator from 'validator';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const createOrder = (req: Request, res: Response, next: NextFunction) => {
  const {
    payment, email, phone, address, total, items,
  } = req.body;

  if (!['card', 'online'].includes(payment)) {
    return next(new BadRequestError('Некорректный способ оплаты'));
  }
  if (typeof email !== 'string' || !validator.isEmail(email)) {
    return next(new BadRequestError('Некорректный email'));
  }
  if (typeof phone !== 'string' || !phone) {
    return next(new BadRequestError('Не указан телефон'));
  }
  if (typeof address !== 'string' || !address) {
    return next(new BadRequestError('Не указан адрес'));
  }
  if (typeof total !== 'number') {
    return next(new BadRequestError('Не указана сумма заказа'));
  }
  if (
    !Array.isArray(items)
    || items.length === 0
    || !items.every((id) => mongoose.isValidObjectId(id))
  ) {
    return next(new BadRequestError('Некорректный список товаров'));
  }

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

      return res.status(201).send({ id: faker.string.uuid(), total });
    })
    .catch(next);
};

export default createOrder;
