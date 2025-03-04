import pool from '../config/db.js';

const findAll = async () => {
  const result = await pool.query("SELECT * FROM product");
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
  return result.rows[0];
};

export { findAll, findById };
