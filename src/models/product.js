import pool from '../config/db.js';

const findAll = async () => {
  const result = await pool.query('SELECT * FROM product');
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async (productData) => {
  const text = `INSERT INTO product (name, description, type_id, unit_price, stock_quantity, limit_quantity) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = Object.values(productData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

export { findAll, findById, create };
