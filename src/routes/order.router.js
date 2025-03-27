import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import orderStatusRouter from './order-status.router.js';

const router = express.Router();

router.use('/statuses', orderStatusRouter);

router.get('/', orderController.getAllOrders);
router.get('/:orderId', orderController.getOrderDetails);
router.post('/', orderController.createOrder);
router.patch('/:orderId/status', orderController.updateOrderStatus);

export default router;
