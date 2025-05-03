import pool from '../config/db.js';

const getCustomers = async (limit, offset, spaceId) => {
  let whereClauses = [];
  let values = [];

  if (spaceId) {
    values.push(spaceId);
    whereClauses.push(`space_id = $${values.length}`);
  }

  const where =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const text = `
    SELECT * FROM customer
    ${where}
    ORDER BY id ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  values.push(limit, offset);

  const result = await pool.query(text, values);
  return result.rows;
};

const getCustomerByCredentials = async (lastName, spaceId) => {
  const text = 'SELECT * FROM customer WHERE last_name = $1 AND space_id = $2';
  const result = await pool.query(text, [lastName, spaceId]);
  return result.rows[0];
};

const getCustomerById = async (customerId) => {
  const text = 'SELECT * FROM customer WHERE id = $1';
  const result = await pool.query(text, [customerId]);
  return result.rows[0];
};

const createCustomer = async (customerData) => {
  const text = `
    INSERT INTO customer (
      first_name,
      last_name,
      arrival_date,
      departure_date,
      space_id
    ) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = Object.values(customerData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

const updateCustomer = async (customerId, customerData) => {
  const text = `
    UPDATE customer
    SET
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      arrival_date = COALESCE($3, arrival_date),
      departure_date = COALESCE($4, departure_date),
      space_id = COALESCE($5, space_id)
    WHERE id = $6
    RETURNING *
  `;
  const values = [...Object.values(customerData), customerId];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteCustomer = async (customerId) => {
  const text = 'DELETE FROM customer WHERE id = $1 RETURNING *';
  const result = await pool.query(text, [customerId]);
  return result.rows[0];
};

export {
  getCustomers,
  getCustomerByCredentials,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
