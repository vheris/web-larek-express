import { Router } from 'express';
import { validateOrder } from '../middlewares/validation';
import createOrder from '../controllers/orders';

const ordersRouter = Router();

ordersRouter.post('/', validateOrder, createOrder);

export default ordersRouter;
