import express from 'express';
import * as employeesController from '../controllers/employees.js';

const router = express.Router();

router.get('/', employeesController.getAllEmployees);
router.get('/:id', employeesController.getEmployee);
router.post('/', employeesController.createEmployee);
router.put('/:id', employeesController.updateEmployee);
router.delete('/:id', employeesController.deleteEmployee);

export default router;
