import express from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import employeeTypeRouter from './employee-type.router.js';

const router = express.Router();

router.use('/types', employeeTypeRouter);

router.get('/', employeeController.getEmployees);
router.get('/:employeeId', employeeController.getEmployee);
router.post('/', employeeController.createEmployee);
router.patch('/:employeeId', employeeController.updateEmployee);
router.delete('/:employeeId', employeeController.deleteEmployee);

export default router;
