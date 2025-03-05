import express from 'express';
import * as productsController from '../controllers/products.js';

const router = express.Router();

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProduct);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);

router.delete('/:id', (req, res) => {
  res.send(`Delete product  ${req.params.id}`);
});

export default router;
