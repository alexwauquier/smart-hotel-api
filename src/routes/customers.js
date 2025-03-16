import express from 'express';
import * as customersController from '../controllers/customers.js';

const router = express.Router();

router.get('/', customersController.getAllCustomers);
router.get('/:id', customersController.getCustomer);
router.post('/', customersController.createCustomer);
router.put('/:id', customersController.updateCustomer);
router.delete('/:id', customersController.deleteCustomer);

export default router;
