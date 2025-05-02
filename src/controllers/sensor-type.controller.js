import * as sensorTypeModel from '../models/sensor-type.model.js';

const getAllSensorTypes = async (req, res) => {
  try {
    const sensorTypes = await sensorTypeModel.getAllSensorTypes();

    if (!sensorTypes.length) {
      return res.status(404).json({
        success: false,
        error:  {
          code: 404,
          message: 'No sensor types found'
        }
      });
    }

    res.status(200).json(sensorTypes);
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

const getSensorType = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const sensorType = await sensorTypeModel.getSensorTypeById(sensorId);

    if (!sensorType) {
      return res.status(404).json({
        success: false,
        error:  {
          code: 404,
          message: 'Sensor type not found'
        }
      });
    }

    res.status(200).json(sensorType);
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

    res.status(201).json(newSensorType);
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

const updateSensorType = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { id, label } = req.body;

    const updatedSensorType = await sensorTypeModel.updateSensorType(
      sensorId, { id, label }
    );

    if (!updatedSensorType) {
      return res.status(404).json({
        success: false,
        error:  {
          code: 404,
          message: 'Sensor type not found'
        }
      });
    }

    res.status(200).json(updatedSensorType);
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

const deleteSensorType = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const deletedSensorType = await sensorTypeModel.deleteSensorType(sensorId);

    if (!deletedSensorType) {
      return res.status(404).json({
        success: false,
        error:  {
          code: 404,
          message: 'Sensor type not found'
        }
      });
    }

    res.status(200).json(deletedSensorType);
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
  getAllSensorTypes,
  getSensorType,
  createSensorType,
  updateSensorType,
  deleteSensorType
};
