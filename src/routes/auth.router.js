import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login/customer', authController.loginCustomer);
router.post('/login/employee', authController.loginEmployee);

export default router;
