import { Router } from 'express';
import { validateProducts } from '../middlewares/validation';
import { createNewProduct, getAllProducts } from '../controllers/products';

const productsRouter = Router();

productsRouter.get('/', getAllProducts);
productsRouter.post('/', validateProducts, createNewProduct);

export default productsRouter;
