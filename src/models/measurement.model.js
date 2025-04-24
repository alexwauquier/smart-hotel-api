import pool from '../config/db.js';

const getAllMeasurements = async () => {
  const text = 'SELECT * FROM sensor_measurement ORDER BY id DESC';
  const result = await pool.query(text);
  return result.rows;
};

const getMeasurementsBySensorId = async (sensorId) => {
  const text = `
    SELECT * FROM sensor_measurement
    WHERE sensor_id = $1
    ORDER BY id DESC
  `;
  const result = await pool.query(text, [sensorId]);
  return result.rows;
};

const createMeasurement = async (measurementData) => {
  const text = `
    INSERT INTO sensor_measurement (
      sensor_id,
      value
    )
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = Object.values(measurementData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

export {
  getAllMeasurements,
  getMeasurementsBySensorId,
  createMeasurement
};
