import { celebrate, Joi, Segments } from 'celebrate';

export const validateProducts = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    image: Joi.object()
      .keys({
        fileName: Joi.string().required(),
        originalName: Joi.string().required(),
      })
      .required(),
    category: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().allow(null),
  }),
});

export const validateOrder = celebrate({
  [Segments.BODY]: Joi.object().keys({
    items: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
    total: Joi.number().required(),
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
  }),
});
