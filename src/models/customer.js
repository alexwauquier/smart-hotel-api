import pool from '../config/db.js';

const findByCredentials = async (lastName, spaceId) => {
  const text = 'SELECT * FROM customer WHERE last_name = $1 AND space_id = $2';
  const result = await pool.query(text, [lastName, spaceId]);
  return result.rows[0];
};

export { findByCredentials };
