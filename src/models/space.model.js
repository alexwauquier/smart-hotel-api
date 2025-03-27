import pool from '../config/db.js';

const getAllSpaces = async () => {
  const text = 'SELECT * FROM space ORDER BY id ASC';
  const result = await pool.query(text);
  return result.rows;
};

const getSpaceById = async (spaceId) => {
  const text = 'SELECT * FROM space WHERE id = $1';
  const result = await pool.query(text, [spaceId]);
  return result.rows[0];
};

const createSpace = async (spaceData) => {
  const text = `
    INSERT INTO space (
      id,
      name,
      type_id,
      capacity
    ) 
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = Object.values(spaceData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

const updateSpace = async (spaceId, spaceData) => {
  const text = `
    UPDATE space
    SET
      id = COALESCE($1, id),
      name = COALESCE($2, name),
      type_id = COALESCE($3, type_id),
      capacity = COALESCE($4, capacity)
    WHERE id = $5
    RETURNING *
  `;
  const values = [...Object.values(spaceData), spaceId];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteSpace = async (spaceId) => {
  const text = 'DELETE FROM space WHERE id = $1 RETURNING *';
  const result = await pool.query(text, [spaceId]);
  return result.rows[0];
};

export {
  getAllSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace
};
