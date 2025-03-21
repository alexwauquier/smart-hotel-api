import pool from '../config/db.js';

const findAll = async () => {
  const result = await pool.query('SELECT * FROM customer');
  return result.rows;
};

const findByCredentials = async (lastName, spaceId) => {
  const text = 'SELECT * FROM customer WHERE last_name = $1 AND space_id = $2';
  const result = await pool.query(text, [lastName, spaceId]);
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM customer WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async (customerData) => {
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

const update = async (id, customerData) => {
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
  const values = [...Object.values(customerData), id];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteById = async (id) => {
  const text = 'DELETE FROM customer WHERE id = $1 RETURNING *';
  const result = await pool.query(text, [id]);
  return result.rows[0];
};

export { findAll, findByCredentials, findById, create, update, deleteById };
