import * as sensorModel from '../models/sensor.model.js';

const getAllSensors = async (req, res) => {
  try {
    const sensors = await sensorModel.getAllSensors();

    if (!sensors.length) {
      return res.status(404).json({ error: 'No sensors found' });
    }

    res.status(200).json(sensors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const sensor = await sensorModel.getSensorById(sensorId);

    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    res.status(200).json(sensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSensor = async (req, res) => {
  try {
    const { name, type_id: typeId, space_id: spaceId } = req.body;

    const newSensor = await sensorModel.createSensor({
      name,
      typeId,
      spaceId
    });

    res.status(201).json(newSensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      return res.status(404).json({ error: 'Sensor not found' });
    }

    res.status(200).json(updatedSensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const deletedSensor = await sensorModel.deleteSensor(sensorId);

    if (!deletedSensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    res.status(200).json(deletedSensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getAllSensors,
  getSensor,
  createSensor,
  updateSensor,
  deleteSensor
};
