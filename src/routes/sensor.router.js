import express from 'express';
import * as sensorController from '../controllers/sensor.controller.js';
import sensorTypeRouter from './sensor-type.router.js';

const router = express.Router();

router.use('/types', sensorTypeRouter);

router.get('/', sensorController.getAllSensors);
router.get('/:sensorId', sensorController.getSensor);
router.post('/', sensorController.createSensor);
router.patch('/:sensorId', sensorController.updateSensor);
router.delete('/:sensorId', sensorController.deleteSensor);

export default router;
