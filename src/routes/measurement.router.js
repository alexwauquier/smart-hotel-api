import express from 'express';
import * as measurementController from '../controllers/measurement.controller.js';

const router = express.Router();

router.get('/', measurementController.getAllMeasurements);
router.get('/:sensorId', measurementController.getSensorMeasurements);
router.post('/', measurementController.createMeasurement);

export default router;
