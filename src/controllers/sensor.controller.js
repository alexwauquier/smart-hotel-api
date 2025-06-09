import * as measurementModel from '../models/measurement.model.js';
import * as sensorModel from '../models/sensor.model.js';
import * as sensorTypeModel from '../models/sensor-type.model.js';
import * as spaceModel from '../models/space.model.js';

const getSensors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 50;
    const typeId = req.query.type_id || null;
    const spaceId = parseInt(req.query.space_id) || null;
    const offset = (page - 1) * size;

    const sensors = await sensorModel.getSensors(size, offset, typeId, spaceId);

    if (!sensors.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No sensors found'
        }
      });
    }

    const sensorsData = await Promise.all(
      sensors.map(async (sensor) => {
        const sensorType = await sensorTypeModel.getSensorTypeById(
          sensor.type_id
        );

        const space = await spaceModel.getSpaceById(sensor.space_id);

        return {
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
        };
      })
    );

    const baseUrl = process.env.API_BASE_URL;
    const typeParam = typeId ? `&type_id=${typeId}` : '';
    const spaceParam = spaceId ? `&space_id=${spaceId}` : '';

    const totalSensors = await sensorModel.countSensors(typeId, spaceId);
    const totalPages = Math.ceil(totalSensors / size);

    const buildLink = (targetPage) =>
      `${baseUrl}/api/sensors?page=${targetPage}&size=${size}${typeParam}${spaceParam}`;

    const links = {
      first: buildLink(1),
      last: buildLink(totalPages),
      prev: page > 1 ? buildLink(page - 1) : null,
      next: page < totalPages ? buildLink(page + 1) : null
    };

    return res.status(200).json({
      success: true,
      meta: {
        page: {
          current: page,
          size,
          total: totalPages
        },
        total_items: totalSensors
      },
      links,
      data: {
        sensors: sensorsData
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const getSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const sensor = await sensorModel.getSensorById(sensorId);

    if (!sensor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Sensor not found'
        }
      });
    }

    const sensorType = await sensorTypeModel.getSensorTypeById(sensor.type_id);

    const space = await spaceModel.getSpaceById(sensor.space_id);

    return res.status(200).json({
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
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
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
    const range = req.query.range || undefined;

    const sensorMeasurements = await measurementModel.getMeasurementsBySensorId(
      sensorId,
      range
    );

    if (!sensorMeasurements.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No sensor measurements found'
        }
      });
    }

    const sensor = await sensorModel.getSensorById(sensorId);
    const sensorType = await sensorTypeModel.getSensorTypeById(sensor.type_id);
    const space = await spaceModel.getSpaceById(sensor.space_id);

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const createSensorMeasurement = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Missing value'
        }
      });
    }

    const newMeasurement = await measurementModel.createMeasurement({
      sensorId,
      value
    });
    const sensor = await sensorModel.getSensorById(sensorId);

    return res.status(201).json({
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
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const createSensor = async (req, res) => {
  try {
    const { name, type_id: typeId, space_id: spaceId } = req.body;

    if (!name || !typeId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Missing name or type_id'
        }
      });
    }

    const newSensor = await sensorModel.createSensor({
      name,
      typeId,
      spaceId
    });

    const sensorType = await sensorTypeModel.getSensorTypeById(
      newSensor.type_id
    );

    const space = await spaceModel.getSpaceById(newSensor.space_id);

    return res.status(201).json({
      success: true,
      data: {
        sensor: {
          id: newSensor.id,
          name: newSensor.name,
          type: {
            id: sensorType.id,
            label: sensorType.label
          },
          space: {
            id: space.id,
            name: space.name
          }
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const updateSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { name, type_id: typeId, space_id: spaceId } = req.body;

    const updatedSensor = await sensorModel.updateSensor(sensorId, {
      name,
      typeId,
      spaceId
    });

    if (!updatedSensor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Sensor not found'
        }
      });
    }

    const sensorType = await sensorTypeModel.getSensorTypeById(
      updatedSensor.type_id
    );

    const space = await spaceModel.getSpaceById(updatedSensor.space_id);

    return res.status(200).json({
      success: true,
      data: {
        sensor: {
          id: updatedSensor.id,
          name: updatedSensor.name,
          type: {
            id: sensorType.id,
            label: sensorType.label
          },
          space: {
            id: space.id,
            name: space.name
          }
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const deleteSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const deletedSensor = await sensorModel.deleteSensor(sensorId);

    if (!deletedSensor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Sensor not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sensor successfully deleted'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

export {
  getSensors,
  getSensor,
  getSensorMeasurements,
  createSensorMeasurement,
  createSensor,
  updateSensor,
  deleteSensor
};
