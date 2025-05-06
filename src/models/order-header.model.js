import pool from '../config/db.js';

const getOrderHeaders = async (limit, offset, employeeId, statusId) => {
  let whereClauses = [];
  let values = [];

  if (employeeId !== undefined) {
    if (employeeId === 'null') {
      whereClauses.push('employee_id IS NULL');
    } else {
      values.push(employeeId);
      whereClauses.push(`employee_id = $${values.length}`);
    }
  }

  if (statusId) {
    values.push(statusId);
    whereClauses.push(`status_id = $${values.length}`);
  }

  const where =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const text = `
    SELECT * FROM order_header
    ${where}
    ORDER BY id ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  values.push(limit, offset);

  const result = await pool.query(text, values);
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

const countOrders = async (statusId) => {
  let whereClauses = [];
  let values = [];

  if (statusId) {
    values.push(statusId);
    whereClauses.push(`status_id = $${values.length}`);
  }

  const where =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const text = `SELECT COUNT(*) FROM order_header ${where}`;

  const result = await pool.query(text, values);
  return result.rows[0].count;
};

export {
  getOrderHeaders,
  getOrderHeaderById,
  getOrdersByCustomerId,
  createOrderHeader,
  updateOrderStatus,
  countOrders
};
