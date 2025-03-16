import pool from '../config/db.js';

const findByUsername = async (username) => {
  const text = 'SELECT * FROM employee WHERE username = $1';
  const result = await pool.query(text, [username]);
  return result.rows[0];
}

export { findByUsername };
