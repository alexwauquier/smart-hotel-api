import express from 'express';
import * as productsController from '../controllers/products.js';

const router = express.Router();

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProduct);
router.post('/', productsController.createProduct);
router.patch('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

export default router;
