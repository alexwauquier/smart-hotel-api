import * as sensorModel from '../models/sensor.model.js';

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

    res.status(200).json({
      success: true,
      data: {
        sensors
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

    res.status(200).json({
      success: true,
      data: {
        sensor
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

    res.status(201).json({
      success: true,
      data: {
        sensor: newSensor
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

    res.status(200).json({
      success: true,
      data: {
        sensor: updatedSensor
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
