import * as argon2 from 'argon2';
import * as employeeModel from '../models/employee.model.js';
import * as employeeTypeModel from '../models/employee-type.model.js';

const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 50, type_id: typeId } = req.query;
    const offset = (page - 1) * limit;

    const employees = await employeeModel.getEmployees(limit, offset, typeId);

    if (!employees.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No employees found'
        }
      });
    }

    const employeesData = await Promise.all(
      employees.map(async (employee) => {
        const employeeType = await employeeTypeModel.getEmployeeTypeById(
          employee.type_id
        );
        return {
          ...employee,
          type_label: employeeType.label
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        employees: employeesData
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await employeeModel.getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Employee not found'
        }
      });
    }

    const employeeType = await employeeTypeModel.getEmployeeTypeById(
      employee.type_id
    );

    const employeeData = {
      ...employee,
      type_label: employeeType.label
    };

    res.status(200).json({
      success: true,
      data: {
        employee: employeeData
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
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

    if (!firstName || !lastName || !username || !password || !typeId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Required fields missing'
        }
      });
    }

    const passwordHash = await argon2.hash(password);

    const newEmployee = await employeeModel.createEmployee({
      firstName,
      lastName,
      username,
      passwordHash,
      typeId
    });

    const employeeType = await employeeTypeModel.getEmployeeTypeById(
      newEmployee.type_id
    );

    const employeeData = {
      ...newEmployee,
      type_label: employeeType.label
    };

    res.status(201).json({
      success: true,
      data: {
        employee: employeeData
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
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
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Employee not found'
        }
      });
    }

    const employeeType = await employeeTypeModel.getEmployeeTypeById(
      updatedEmployee.type_id
    );

    const employeeData = {
      ...updatedEmployee,
      type_label: employeeType.label
    };

    res.status(200).json({
      success: true,
      data: {
        employee: employeeData
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const deletedEmployee = await employeeModel.deleteEmployee(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Employee not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee successfully deleted'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

export {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
