import pool from '../config/db.js';

const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM product');
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
  return result.rows[0];
};

const createProduct = async (productData) => {
  const text = `
    INSERT INTO product (
      name,
      description,
      ingredients,
      type_id,
      contains_alcohol,
      unit_price,
      stock_quantity,
      limit_quantity
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const values = Object.values(productData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

const updateProduct = async (id, productData) => {
  const text = `
    UPDATE product
    SET
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      ingredients = COALESCE($3, ingredients),
      type_id = COALESCE($4, type_id),
      contains_alcohol = COALESCE($5, contains_alcohol),
      unit_price = COALESCE($6, unit_price),
      stock_quantity = COALESCE($7, stock_quantity),
      limit_quantity = COALESCE($8, limit_quantity)
    WHERE id = $9
    RETURNING *;
  `;
  const values = [...Object.values(productData), id];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteProduct = async (id) => {
  const text = `
    DELETE FROM product
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(text, [id]);
  return result.rows[0];
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
