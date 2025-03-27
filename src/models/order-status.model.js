import pool from '../config/db.js';

const getAllOrderStatuses = async () => {
  const result = await pool.query('SELECT * FROM order_status');
  return result.rows;
};

const getOrderStatusById = async (statusId) => {
  const text = 'SELECT * FROM order_status WHERE id = $1';
  const result = await pool.query(text, [statusId]);
  return result.rows[0];
};

const createOrderStatus = async (orderStatusData) => {
  const text = `
    INSERT INTO order_status (id, label)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = Object.values(orderStatusData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

const updateOrderStatus = async (statusId, orderStatusData) => {
  const text = `
    UPDATE order_status
    SET
      id = COALESCE($1, id),
      label = COALESCE($2, label)
    WHERE id = $3
    RETURNING *
  `;
  const values = [...Object.values(orderStatusData), statusId];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteOrderStatus = async (statusId) => {
  const text = 'DELETE FROM order_status WHERE id = $1 RETURNING *';
  const result = await pool.query(text, [statusId]);
  return result.rows[0];
};

export {
  getAllOrderStatuses,
  getOrderStatusById,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus
};
