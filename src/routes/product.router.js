import express from 'express';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProduct);
router.post('/', productController.createProduct);
router.patch('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);

export default router;
