import express from 'express';
import * as productController from '../controllers/product.controller.js';
import productTypeRouter from './product-type.router.js';
import { verifyRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use('/types', verifyRole(['employee']), productTypeRouter);

router.get('/', productController.getProducts);
router.get('/:productId', productController.getProduct);
router.post('/', verifyRole(['employee']), productController.createProduct);
router.patch(
  '/:productId',
  verifyRole(['employee']),
  productController.updateProduct
);
router.delete(
  '/:productId',
  verifyRole(['employee']),
  productController.deleteProduct
);

export default router;
