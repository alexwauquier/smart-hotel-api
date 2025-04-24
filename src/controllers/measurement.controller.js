import * as measurementModel from '../models/measurement.model.js';

const getAllMeasurements = async (req, res) => {
  try {
    const measurements = await measurementModel.getAllMeasurements();

    if (!measurements.length) {
      return res.status(404).json({ error: 'No measurements found' });
    }

    res.status(200).json(measurements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSensorMeasurements = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const sensorMeasurements = await measurementModel.getMeasurementsBySensorId(sensorId);

    if (!sensorMeasurements.length) {
      return res.status(404).json({ error: 'Sensor measurements not found' });
    }

    res.status(200).json(sensorMeasurements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMeasurement = async (req, res) => {
  try {
    const {
      sensor_id: sensorId,
      value
    } = req.body;

    const newMeasurement = await measurementModel.createMeasurement({
      sensorId,
      value
    });

    res.status(201).json(newMeasurement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getAllMeasurements,
  getSensorMeasurements,
  createMeasurement
};
