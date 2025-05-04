import * as sensorModel from '../models/sensor.model.js';
import * as sensorTypeModel from '../models/sensor-type.model.js';
import * as spaceModel from '../models/space.model.js';

const getSensors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      type_id: typeId,
      space_id: spaceId
    } = req.query;
    const offset = (page - 1) * limit;

    const sensors = await sensorModel.getSensors(
      limit,
      offset,
      typeId,
      spaceId
    );

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
          type_id: sensor.type_id,
          type_label: sensorType.label,
          space: {
            id: space.id,
            name: space.name
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        sensors: sensorsData
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

    res.status(200).json({
      success: true,
      data: {
        sensor: {
          id: sensor.id,
          name: sensor.name,
          type_id: sensor.type_id,
          type_label: sensorType.label,
          space: {
            id: space.id,
            name: space.name
          }
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

    res.status(201).json({
      success: true,
      data: {
        sensor: {
          id: newSensor.id,
          name: newSensor.name,
          type_id: newSensor.type_id,
          type_label: sensorType.label,
          space: {
            id: space.id,
            name: space.name
          }
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

    res.status(200).json({
      success: true,
      data: {
        sensor: {
          id: updatedSensor.id,
          name: updatedSensor.name,
          type_id: updatedSensor.type_id,
          type_label: sensorType.label,
          space: {
            id: space.id,
            name: space.name
          }
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

    res.status(200).json({
      success: true,
      message: 'Sensor successfully deleted'
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

export { getSensors, getSensor, createSensor, updateSensor, deleteSensor };
