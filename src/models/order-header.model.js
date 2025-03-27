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

const createOrderHeader = async (customerId, spaceId) => {
  const text = `
    INSERT INTO order_header (customer_id, space_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await pool.query(text, [customerId, spaceId]);
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
  createOrderHeader,
  updateOrderStatus
};
