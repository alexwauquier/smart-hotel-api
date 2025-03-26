import pool from '../config/db.js';

const createOrderHeader = async (customerId) => {
  const text = 'INSERT INTO order_header (customer_id) VALUES ($1) RETURNING *';
  const result = await pool.query(text, [customerId]);
  return result.rows[0];
};

export { createOrderHeader };
