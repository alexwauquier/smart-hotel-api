import express from 'express';
import * as sensorController from '../controllers/sensor.controller.js';

const router = express.Router();

router.get('/', sensorController.getAllSensors);
router.get('/:sensorId', sensorController.getSensor);
router.post('/', sensorController.createSensor);
router.patch('/:sensorId', sensorController.updateSensor);
router.delete('/:sensorId', sensorController.deleteSensor);

export default router;
