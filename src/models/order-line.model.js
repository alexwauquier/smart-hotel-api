import pool from '../config/db.js';

const createOrderLine = async (orderHeaderId, productId, productQuantity) => {
  const text = `
    INSERT INTO order_line (order_header_id, product_id, product_quantity)
    VALUES ($1, $2, $3) RETURNING *
  `;
  const values = [orderHeaderId, productId, productQuantity];
  const result = await pool.query(text, values);
  return result.rows[0];
};

export { createOrderLine };
