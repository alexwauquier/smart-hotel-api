import pool from '../config/db.js';

const getMeasurements = async (limit, offset, sensorId) => {
  let whereClauses = [];
  let values = [];

  if (sensorId) {
    values.push(sensorId);
    whereClauses.push(`sensor_id = $${values.length}`);
  }

  const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const text = `
    SELECT * FROM sensor_measurement
    ${where}
    ORDER BY id DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  values.push(limit, offset);

  const result = await pool.query(text, values);
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
  getMeasurements,
  getMeasurementsBySensorId,
  createMeasurement
};
