import express from 'express';
import * as customerController from '../controllers/customer.controller.js';

const router = express.Router();

router.get('/', customerController.getAllCustomers);
router.get('/:customerId', customerController.getCustomer);
router.post('/', customerController.createCustomer);
router.patch('/:customerId', customerController.updateCustomer);
router.delete('/:customerId', customerController.deleteCustomer);

export default router;
