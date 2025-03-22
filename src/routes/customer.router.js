import express from 'express';
import * as customerController from '../controllers/customer.controller.js';

const router = express.Router();

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/', customerController.createCustomer);
router.patch('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
