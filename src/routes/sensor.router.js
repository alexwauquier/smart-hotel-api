import express from 'express';
import * as sensorController from '../controllers/sensor.controller.js';
import sensorTypeRouter from './sensor-type.router.js';

const router = express.Router();

router.use('/types', sensorTypeRouter);

router.get('/', sensorController.getSensors);
router.get('/:sensorId', sensorController.getSensor);
router.get('/:sensorId/measurements', sensorController.getSensorMeasurements);
router.post(
  '/:sensorId/measurements',
  sensorController.createSensorMeasurement
);
router.post('/', sensorController.createSensor);
router.patch('/:sensorId', sensorController.updateSensor);
router.delete('/:sensorId', sensorController.deleteSensor);

export default router;
