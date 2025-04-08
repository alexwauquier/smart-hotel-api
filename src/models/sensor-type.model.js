import pool from '../config/db.js';

const getAllSensorTypes = async () => {
  const result = await pool.query('SELECT * FROM sensor_type');
  return result.rows;
};

const getSensorTypeById = async (typeId) => {
  const text = 'SELECT * FROM sensor_type WHERE id = $1';
  const result = await pool.query(text, [typeId]);
  return result.rows[0];
};

const createSensorType = async (sensorTypeData) => {
  const text = `
    INSERT INTO sensor_type (id, label)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = Object.values(sensorTypeData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

const updateSensorType = async (typeId, sensorTypeData) => {
  const text = `
    UPDATE sensor_type
    SET
      id = COALESCE($1, id),
      label = COALESCE($2, label)
    WHERE id = $3
    RETURNING *
  `;
  const values = [...Object.values(sensorTypeData), typeId];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteSensorType = async (typeId) => {
  const text = 'DELETE FROM sensor_type WHERE id = $1 RETURNING *';
  const result = await pool.query(text, [typeId]);
  return result.rows[0];
};

export {
  getAllSensorTypes,
  getSensorTypeById,
  createSensorType,
  updateSensorType,
  deleteSensorType
};
