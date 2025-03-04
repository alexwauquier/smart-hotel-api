import express from 'express';
import * as productsController from '../controllers/products.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Get all products');
});

router.get('/:id', productsController.getProduct);

router.post('/', (req, res) => {
  res.send('Create a product');
});

router.put('/:id', (req, res) => {
  res.send(`Update product ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
  res.send(`Delete product  ${req.params.id}`);
});

export default router;
