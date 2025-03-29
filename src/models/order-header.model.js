import pool from '../config/db.js';

const getAllOrderHeaders = async () => {
  const text = 'SELECT * FROM order_header ORDER BY id DESC';
  const result = await pool.query(text);
  return result.rows;
};

const getOrderHeaderById = async (orderId) => {
  const text = 'SELECT * FROM order_header WHERE id = $1';
  const result = await pool.query(text, [orderId]);
  return result.rows[0];
};

const getOrdersByCustomerId = async (customerId) => {
  const text = `
    SELECT * FROM order_header
    WHERE customer_id = $1
    ORDER BY id DESC
  `;
  const result = await pool.query(text, [customerId]);
  return result.rows;
};

const createOrderHeader = async (client, customerId, spaceId) => {
  const text = `
    INSERT INTO order_header (customer_id, space_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await client.query(text, [customerId, spaceId]);
  return result.rows[0];
};

const updateOrderStatus = async (orderId, status) => {
  const text = `
    UPDATE order_header
    SET status_id = $1
    WHERE id = $2
    RETURNING *
  `;
  const result = await pool.query(text, [status, orderId]);
  return result.rows[0];
};

export {
  getAllOrderHeaders,
  getOrderHeaderById,
  getOrdersByCustomerId,
  createOrderHeader,
  updateOrderStatus
};
