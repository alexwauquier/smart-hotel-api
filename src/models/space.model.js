import pool from '../config/db.js';

const getSpaces = async (
  limit,
  offset,
  typeId,
  capacity,
  sortBy,
  sortOrder
) => {
  let whereClauses = [];
  let values = [];

  if (typeId) {
    values.push(typeId);
    whereClauses.push(`type_id = $${values.length}`);
  }

  if (capacity) {
    values.push(capacity);
    whereClauses.push(`capacity = $${values.length}`);
  }

  const where =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const allowedSortColumns = ['id', 'name', 'type_id', 'capacity'];

  if (!allowedSortColumns.includes(sortBy)) {
    sortBy = 'id';
  }

  sortOrder = sortOrder === 'desc' ? 'DESC' : 'ASC';

  const text = `
    SELECT * FROM space
    ${where}
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  values.push(limit, offset);

  const result = await pool.query(text, values);
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

const countSpaces = async (typeId, capacity) => {
  let whereClauses = [];
  let values = [];

  if (typeId) {
    values.push(typeId);
    whereClauses.push(`type_id = $${values.length}`);
  }

  if (capacity) {
    values.push(capacity);
    whereClauses.push(`capacity = $${values.length}`);
  }

  const where =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const text = `SELECT COUNT(*) FROM space ${where}`;

  const result = await pool.query(text, values);
  return result.rows[0].count;
};

export {
  getSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
  countSpaces
};
