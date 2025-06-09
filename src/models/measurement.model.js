import pool from '../config/db.js';

const getMeasurementsBySensorId = async (sensorId, range = 'last_30_days', sortBy, sortOrder) => {
  let text = `
    SELECT id, value, timestamp FROM sensor_measurement
    WHERE sensor_id = $1
  `;
  let interval;

  if (range === 'last_30_days') interval = '30 days';
  else if (range === 'last_7_days') interval = '7 days';
  else if (range === 'last_24_hours') interval = '24 hours';
  else
    throw new Error(
      "Invalid 'range' parameter. Use 'last_30_days' (default), 'last_7_days' or 'last_24_hours'."
    );

  const allowedSortColumns = [
    'id',
    'sensor_id',
    'value',
    'timestamp'
  ];

  if (!allowedSortColumns.includes(sortBy)) {
    sortBy = 'timestamp';
  }

  sortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';

  text += ` AND timestamp >= NOW() - INTERVAL '${interval}'`;
  text += ` ORDER BY ${sortBy} ${sortOrder}`;

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

export { getMeasurementsBySensorId, createMeasurement };
