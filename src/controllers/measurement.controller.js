import * as measurementModel from '../models/measurement.model.js';

const getMeasurements = async (req, res) => {
  try {
    const { page = 1, limit = 50, sensor_id: sensorId } = req.query;
    const offset = (page - 1) * limit;

    const measurements = await measurementModel.getMeasurements(limit, offset, sensorId);

    if (!measurements.length) {
      return res.status(404).json({
        success: false,
        error:  {
          code: 404,
          message: 'No measurements found'
        }
      });
    }

    res.status(200).json(measurements);
  } catch (err) {
    res.status(500).json({
      success: false,
      error:  {
        code: 500,
        message: err.message
      }
    });
  }
};

const getSensorMeasurements = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const sensorMeasurements = await measurementModel.getMeasurementsBySensorId(sensorId);

    if (!sensorMeasurements.length) {
      return res.status(404).json({
        success: false,
        error:  {
          code: 404,
          message: 'Sensor measurements not found'
        }
      });
    }

    res.status(200).json(sensorMeasurements);
  } catch (err) {
    res.status(500).json({
      success: false,
      error:  {
        code: 500,
        message: err.message
      }
    });
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
    res.status(500).json({
      success: false,
      error:  {
        code: 500,
        message: err.message
      }
    });
  }
};

export {
  getMeasurements,
  getSensorMeasurements,
  createMeasurement
};
