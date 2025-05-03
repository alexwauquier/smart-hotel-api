import pool from '../config/db.js';

const getEmployees = async (limit, offset, typeId) => {
  let whereClauses = [];
  let values = [];

  if (typeId) {
    values.push(typeId);
    whereClauses.push(`type_id = $${values.length}`);
  }

  const where =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const text = `
    SELECT id, first_name, last_name, username, type_id
    FROM employee
    ${where}
    ORDER BY id ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  values.push(limit, offset);

  const result = await pool.query(text, values);
  return result.rows;
};

const getEmployeeById = async (employeeId) => {
  const text = `
    SELECT id, first_name, last_name, username, type_id
    FROM employee
    WHERE id = $1
  `;
  const result = await pool.query(text, [employeeId]);
  return result.rows[0];
};

const getEmployeeByUsername = async (username) => {
  const text = 'SELECT * FROM employee WHERE username = $1';
  const result = await pool.query(text, [username]);
  return result.rows[0];
};

const createEmployee = async (employeeData) => {
  const text = `
    INSERT INTO employee (
      first_name,
      last_name,
      username,
      password_hash,
      type_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, first_name, last_name, username, type_id
  `;
  const values = Object.values(employeeData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

const updateEmployee = async (employeeId, employeeData) => {
  const text = `
    UPDATE employee
    SET
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      username = COALESCE($3, username),
      password_hash = COALESCE($4, password_hash),
      type_id = COALESCE($5, type_id)
    WHERE id = $6
    RETURNING id, first_name, last_name, type_id
  `;
  const values = [...Object.values(employeeData), employeeId];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteEmployee = async (employeeId) => {
  const text = `
    DELETE FROM employee
    WHERE id = $1
    RETURNING first_name, last_name, type_id
  `;
  const result = await pool.query(text, [employeeId]);
  return result.rows[0];
};

export {
  getEmployees,
  getEmployeeById,
  getEmployeeByUsername,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
