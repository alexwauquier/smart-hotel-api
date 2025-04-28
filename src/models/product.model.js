import pool from '../config/db.js';

const getProducts = async (limit, offset, typeId, containsAlcohol) => {
  let whereClauses = [];
  let values = [];

  if (typeId) {
    values.push(typeId);
    whereClauses.push(`type_id = $${values.length}`);
  }

  if (containsAlcohol) {
    values.push(containsAlcohol);
    whereClauses.push(`contains_alcohol = $${values.length}`);
  }

  const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const text = `
    SELECT * FROM product
    ${where}
    ORDER BY id ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  values.push(limit, offset);

  const result = await pool.query(text, values);
  return result.rows;
};

const getProductById = async (productId) => {
  const text = 'SELECT * FROM product WHERE id = $1';
  const result = await pool.query(text, [productId]);
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

const updateProduct = async (productId, productData) => {
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
    RETURNING *
  `;
  const values = [...Object.values(productData), productId];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteProduct = async (productId) => {
  const text = 'DELETE FROM product WHERE id = $1 RETURNING *';
  const result = await pool.query(text, [productId]);
  return result.rows[0];
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
