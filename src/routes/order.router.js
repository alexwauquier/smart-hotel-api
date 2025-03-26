import express from 'express';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.get('/', orderController.getAllOrders);
router.get('/:orderId', orderController.getOrderDetails);
router.post('/', orderController.createOrder);

export default router;
