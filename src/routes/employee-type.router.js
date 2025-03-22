import express from 'express';
import * as employeeTypeController from '../controllers/employee-type.controller.js';

const router = express.Router();

router.get('/', employeeTypeController.getAllEmployeeTypes);
router.get('/:typeId', employeeTypeController.getEmployeeType);
router.post('/', employeeTypeController.createEmployeeType);
router.patch('/:typeId', employeeTypeController.updateEmployeeType);
router.delete('/:typeId', employeeTypeController.deleteEmployeeType);

export default router;
