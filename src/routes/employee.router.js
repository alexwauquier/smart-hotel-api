import express from 'express';
import * as employeeController from '../controllers/employee..controller.js';

const router = express.Router();

router.get('/', employeeController.getAllEmployees);
router.get('/:employeeId', employeeController.getEmployee);
router.post('/', employeeController.createEmployee);
router.patch('/:employeeId', employeeController.updateEmployee);
router.delete('/:employeeId', employeeController.deleteEmployee);

export default router;
