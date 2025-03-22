import pool from '../config/db.js';

const getAllProductTypes = async () => {
  const result = await pool.query('SELECT * FROM product_type');
  return result.rows;
};

const getProductTypeById = async (typeId) => {
  const text = 'SELECT * FROM product_type WHERE id = $1';
  const result = await pool.query(text, [typeId]);
  return result.rows[0];
};

const createProductType = async (productTypeData) => {
  const text = `
    INSERT INTO product_type (id, label)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = Object.values(productTypeData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

const updateProductType = async (typeId, productTypeData) => {
  const text = `
    UPDATE product_type
    SET
      id = COALESCE($1, id),
      label = COALESCE($2, label)
    WHERE id = $3
    RETURNING *
  `;
  const values = [...Object.values(productTypeData), typeId];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteProductType = async (typeId) => {
  const text = `
    DELETE FROM product_type
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(text, [typeId]);
  return result.rows[0];
};

export {
  getAllProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType
};
