import * as argon2 from 'argon2';
import * as employeeModel from '../models/employee.model.js';

const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.getAllEmployees();

    if (!employees) {
      return res.status(404).json({ error: 'No employees found' });
    }

    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await employeeModel.getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const {
      first_name: firstName,
      last_name: lastName,
      username,
      password,
      type_id: typeId
    } = req.body;

    const passwordHash = await argon2.hash(password);

    const newEmployee = await employeeModel.createEmployee({
      firstName,
      lastName,
      username,
      passwordHash,
      typeId
    });

    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      first_name: firstName,
      last_name: lastName,
      username,
      password,
      type_id: typeId
    } = req.body;

    const passwordHash = await argon2.hash(password);

    const updatedEmployee = await employeeModel.updateEmployee(employeeId, {
      firstName,
      lastName,
      username,
      passwordHash,
      typeId
    });

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const deletedEmployee = await employeeModel.deleteEmployee(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(deletedEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
