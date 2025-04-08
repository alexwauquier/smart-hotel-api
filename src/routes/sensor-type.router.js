import express from 'express';
import * as sensorTypeController from '../controllers/sensor-type.controller.js';

const router = express.Router();

router.get('/', sensorTypeController.getAllSensorTypes);
router.get('/:sensorId', sensorTypeController.getSensorType);
router.post('/', sensorTypeController.createSensorType);
router.patch('/:sensorId', sensorTypeController.updateSensorType);
router.delete('/:sensorId', sensorTypeController.deleteSensorType);

export default router;
