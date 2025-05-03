import pool from '../config/db.js';

const getOrderLinesByOrderId = async (orderId) => {
  const text = `
    SELECT * FROM order_line
    WHERE order_header_id = $1
    ORDER BY id ASC
  `;
  const result = await pool.query(text, [orderId]);
  return result.rows;
};

const createOrderLine = async (
  client,
  orderHeaderId,
  productId,
  productQuantity
) => {
  const text = `
    INSERT INTO order_line (order_header_id, product_id, product_quantity)
    VALUES ($1, $2, $3) RETURNING *
  `;
  const values = [orderHeaderId, productId, productQuantity];
  const result = await client.query(text, values);
  return result.rows[0];
};

export { getOrderLinesByOrderId, createOrderLine };
