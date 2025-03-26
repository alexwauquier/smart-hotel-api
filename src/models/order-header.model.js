import pool from '../config/db.js';

const getAllOrderHeaders = async () => {
  const result = await pool.query('SELECT * FROM order_header');
  return result.rows;
};

const getOrderHeaderById = async (orderId) => {
  const text = 'SELECT * FROM order_header WHERE id = $1';
  const result = await pool.query(text, [orderId]);
  return result.rows[0];
};

const createOrderHeader = async (customerId) => {
  const text = 'INSERT INTO order_header (customer_id) VALUES ($1) RETURNING *';
  const result = await pool.query(text, [customerId]);
  return result.rows[0];
};

export { getAllOrderHeaders, getOrderHeaderById, createOrderHeader };
