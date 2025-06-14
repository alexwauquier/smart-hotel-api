import * as sensorTypeModel from '../models/sensor-type.model.js';

const getAllSensorTypes = async (req, res) => {
  try {
    const sensorTypes = await sensorTypeModel.getAllSensorTypes();

    if (!sensorTypes.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No sensor types found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        sensor_types: sensorTypes
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

const getSensorType = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const sensorType = await sensorTypeModel.getSensorTypeById(sensorId);

    if (!sensorType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Sensor type not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        sensor_type: sensorType
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

const createSensorType = async (req, res) => {
  try {
    const { id, label } = req.body;

    if (!id || !label) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Missing id or label'
        }
      });
    }

    const newSensorType = await sensorTypeModel.createSensorType({ id, label });

    return res.status(201).json({
      success: true,
      data: {
        sensor_type: newSensorType
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

const updateSensorType = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { id, label } = req.body;

    const updatedSensorType = await sensorTypeModel.updateSensorType(sensorId, {
      id,
      label
    });

    if (!updatedSensorType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Sensor type not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        sensor_type: updatedSensorType
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

const deleteSensorType = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const deletedSensorType = await sensorTypeModel.deleteSensorType(sensorId);

    if (!deletedSensorType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Sensor type not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sensor type successfully deleted'
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
  getAllSensorTypes,
  getSensorType,
  createSensorType,
  updateSensorType,
  deleteSensorType
};
