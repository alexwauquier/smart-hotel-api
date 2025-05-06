import pool from '../config/db.js';

const getSensors = async (limit, offset, typeId, spaceId) => {
  let whereClauses = [];
  let values = [];

  if (typeId) {
    values.push(typeId);
    whereClauses.push(`type_id = $${values.length}`);
  }

  if (spaceId) {
    values.push(spaceId);
    whereClauses.push(`space_id = $${values.length}`);
  }

  const where =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const text = `
    SELECT * FROM sensor
    ${where}
    ORDER BY id ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  values.push(limit, offset);

  const result = await pool.query(text, values);
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

const countSensors = async (typeId, spaceId) => {
  let whereClauses = [];
  let values = [];

  if (typeId) {
    values.push(typeId);
    whereClauses.push(`type_id = $${values.length}`);
  }

  if (spaceId) {
    values.push(spaceId);
    whereClauses.push(`space_id = $${values.length}`);
  }

  const where =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const text = `SELECT COUNT(*) FROM sensor ${where}`;

  const result = await pool.query(text, values);
  return result.rows[0].count;
};

export { getSensors, getSensorById, createSensor, updateSensor, deleteSensor, countSensors };
