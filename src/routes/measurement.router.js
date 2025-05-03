import express from 'express';
import * as measurementController from '../controllers/measurement.controller.js';
import { verifyRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', measurementController.getMeasurements);
router.get('/:sensorId', measurementController.getSensorMeasurements);
router.post(
  '/',
  verifyRole(['employee']),
  measurementController.createMeasurement
);

export default router;
