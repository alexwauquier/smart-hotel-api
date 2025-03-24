import pool from '../config/db.js';

const getAllSpaceTypes = async () => {
  const result = await pool.query('SELECT * FROM space_type');
  return result.rows;
};

const getSpaceTypeById = async (typeId) => {
  const text = 'SELECT * FROM space_type WHERE id = $1';
  const result = await pool.query(text, [typeId]);
  return result.rows[0];
};

const createSpaceType = async (spaceTypeData) => {
  const text = `
    INSERT INTO space_type (id, label)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = Object.values(spaceTypeData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

const updateSpaceType = async (typeId, spaceTypeData) => {
  const text = `
    UPDATE space_type
    SET
      id = COALESCE($1, id),
      label = COALESCE($2, label)
    WHERE id = $3
    RETURNING *
  `;
  const values = [...Object.values(spaceTypeData), typeId];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteSpaceType = async (typeId) => {
  const text = 'DELETE FROM space_type WHERE id = $1 RETURNING *';
  const result = await pool.query(text, [typeId]);
  return result.rows[0];
};

export {
  getAllSpaceTypes,
  getSpaceTypeById,
  createSpaceType,
  updateSpaceType,
  deleteSpaceType
};
