import express from 'express';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', orderController.createOrder);

export default router;
