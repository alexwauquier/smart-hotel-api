import pool from '../config/db.js';

const getAllEmployeeTypes = async () => {
  const result = await pool.query('SELECT * FROM employee_type');
  return result.rows;
};

const getEmployeeTypeById = async (typeId) => {
  const text = 'SELECT * FROM employee_type WHERE id = $1';
  const result = await pool.query(text, [typeId]);
  return result.rows[0];
};

const createEmployeeType = async (employeeTypeData) => {
  const text = `
    INSERT INTO employee_type (id, label)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = Object.values(employeeTypeData);
  const result = await pool.query(text, values);
  return result.rows[0];
};

const updateEmployeeType = async (typeId, employeeTypeData) => {
  const text = `
    UPDATE employee_type
    SET
      id = COALESCE($1, id),
      label = COALESCE($2, label)
    WHERE id = $3
    RETURNING *
  `;
  const values = [...Object.values(employeeTypeData), typeId];
  const result = await pool.query(text, values);
  return result.rows[0];
};

const deleteEmployeeType = async (typeId) => {
  const text = `
    DELETE FROM employee_type
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(text, [typeId]);
  return result.rows[0];
};

export {
  getAllEmployeeTypes,
  getEmployeeTypeById,
  createEmployeeType,
  updateEmployeeType,
  deleteEmployeeType
};
