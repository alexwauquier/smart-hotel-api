import pool from '../config/db.js';

const getAllSensors = async () => {
  const text = 'SELECT * FROM sensor ORDER BY id ASC';
  const result = await pool.query(text);
  return result.rows;
};

const getSensorById = async (sensorId) => {
  const text = 'SELECT * FROM sensor WHERE id = $1';
  const result = await pool.query(text, [sensorId]);
  return result.rows[0];
};

const createSensor = async (sensorData) => {
  const text = `
    INSERT INTO sensor (
      name,
      type_id,
      space_id
    ) 
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = Object.values(sensorData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

const updateSensor = async (sensorId, sensorData) => {
  const text = `
    UPDATE sensor
    SET
      name = COALESCE($1, name),
      type_id = COALESCE($2, type_id),
      space_id = COALESCE($3, space_id)
    WHERE id = $4
    RETURNING *
  `;
  const values = [...Object.values(sensorData), sensorId];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteSensor = async (sensorId) => {
  const text = 'DELETE FROM sensor WHERE id = $1 RETURNING *';
  const result = await pool.query(text, [sensorId]);
  return result.rows[0];
};

export {
  getAllSensors,
  getSensorById,
  createSensor,
  updateSensor,
  deleteSensor
};
