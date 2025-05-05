import * as measurementModel from '../models/measurement.model.js';
import * as sensorModel from '../models/sensor.model.js';
import * as sensorTypeModel from '../models/sensor-type.model.js';
import * as spaceModel from '../models/space.model.js';

const getMeasurements = async (req, res) => {
  try {
    const { page = 1, limit = 50, sensor_id: sensorId } = req.query;
    const offset = (page - 1) * limit;

    const measurements = await measurementModel.getMeasurements(
      limit,
      offset,
      sensorId
    );

    if (!measurements.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No measurements found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        measurements
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const getSensorMeasurements = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const sensorMeasurements =
      await measurementModel.getMeasurementsBySensorId(sensorId);

    if (!sensorMeasurements.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Sensor measurements not found'
        }
      });
    }

    const sensor = await sensorModel.getSensorById(sensorId);
    const sensorType = await sensorTypeModel.getSensorTypeById(sensor.type_id);
    const space = await spaceModel.getSpaceById(sensor.space_id);

    res.status(200).json({
      success: true,
      data: {
        sensor: {
          id: sensor.id,
          name: sensor.name,
          type: {
            id: sensorType.id,
            label: sensorType.label
          },
          space: {
            id: space.id,
            name: space.name
          }
        },
        measurements: sensorMeasurements
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const createMeasurement = async (req, res) => {
  try {
    const { sensor_id: sensorId, value } = req.body;

    if (!sensorId || !value) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Missing sensor_id or value'
        }
      });
    }

    const newMeasurement = await measurementModel.createMeasurement({
      sensorId,
      value
    });
    const sensor = await sensorModel.getSensorById(sensorId);

    res.status(201).json({
      success: true,
      data: {
        measurement: {
          id: newMeasurement.id,
          value: newMeasurement.value,
          timestamp: newMeasurement.timestamp
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

export { getMeasurements, getSensorMeasurements, createMeasurement };
