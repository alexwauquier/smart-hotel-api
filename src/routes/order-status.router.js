import express from 'express';
import * as orderStatusController from '../controllers/order-status.controller.js';

const router = express.Router();

router.get('/', orderStatusController.getAllOrderStatuses);
router.get('/:statusId', orderStatusController.getOrderStatus);
router.post('/', orderStatusController.createOrderStatus);
router.patch('/:statusId', orderStatusController.updateOrderStatus);
router.delete('/:statusId', orderStatusController.deleteOrderStatus);

export default router;
