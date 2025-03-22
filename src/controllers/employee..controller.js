import * as argon2 from 'argon2';
import * as employeeModel from '../models/employee.model.js';

const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.findAll();

    if (!employees) {
      return res.status(404).json({ error: 'No employees found' })
    }

    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await employeeModel.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, username, password, type_id } = req.body;
    const password_hash = await argon2.hash(password);

    const newEmployee = await employeeModel.create({
      first_name,
      last_name,
      username,
      password_hash,
      type_id
    });

    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, username, password, type_id } = req.body;
    const password_hash = await argon2.hash(password);

    const updatedEmployee = await employeeModel.update(id, {
      first_name,
      last_name,
      username,
      password_hash,
      type_id
    });

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.status(200).json(updatedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await employeeModel.deleteById(id);

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.status(200).json(deletedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
