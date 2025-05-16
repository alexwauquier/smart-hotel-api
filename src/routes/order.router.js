import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import orderStatusRouter from './order-status.router.js';
import { verifyRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use('/statuses', verifyRole(['employee']), orderStatusRouter);

router.get('/', verifyRole(['employee']), orderController.getOrders);
router.get('/:orderId', orderController.getOrderDetails);
router.post('/', orderController.createOrder);
router.patch(
  '/:orderId/employee',
  verifyRole(['employee']),
  orderController.updateOrderEmployee
);
router.patch(
  '/:orderId/status',
  verifyRole(['employee']),
  orderController.updateOrderStatus
);

export default router;
