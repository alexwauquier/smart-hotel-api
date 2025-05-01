import express from 'express';
import * as customerController from '../controllers/customer.controller.js';
import { verifyRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyRole(['employee']), customerController.getCustomers);
router.get('/:customerId', customerController.getCustomer);
router.get('/:customerId/orders', customerController.getCustomerOrders);
router.post('/', verifyRole(['employee']), customerController.createCustomer);
router.patch('/:customerId', verifyRole(['employee']), customerController.updateCustomer);
router.delete('/:customerId', verifyRole(['employee']), customerController.deleteCustomer);

export default router;
