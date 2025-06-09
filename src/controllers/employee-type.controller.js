import * as employeeTypeModel from '../models/employee-type.model.js';

const getAllEmployeeTypes = async (req, res) => {
  try {
    const employeeTypes = await employeeTypeModel.getAllEmployeeTypes();

    if (!employeeTypes.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No employee types found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        employee_types: employeeTypes
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const getEmployeeType = async (req, res) => {
  try {
    const { typeId } = req.params;

    const employeeType = await employeeTypeModel.getEmployeeTypeById(typeId);

    if (!employeeType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Employee type not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        employee_type: employeeType
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const createEmployeeType = async (req, res) => {
  try {
    const { id, label } = req.body;

    if (!id || !label) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Missing id or label'
        }
      });
    }

    const newEmployeeType = await employeeTypeModel.createEmployeeType({
      id,
      label
    });
    return res.status(201).json({
      success: true,
      data: {
        employee_type: newEmployeeType
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const updateEmployeeType = async (req, res) => {
  try {
    const { typeId } = req.params;
    const { id, label } = req.body;

    const updatedEmployeeType = await employeeTypeModel.updateEmployeeType(
      typeId,
      {
        id,
        label
      }
    );

    if (!updatedEmployeeType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Employee type not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        employee_type: updatedEmployeeType
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

const deleteEmployeeType = async (req, res) => {
  try {
    const { typeId } = req.params;

    const deletedEmployeeType =
      await employeeTypeModel.deleteEmployeeType(typeId);

    if (!deletedEmployeeType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Employee type not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee type successfully deleted'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  }
};

export {
  getAllEmployeeTypes,
  getEmployeeType,
  createEmployeeType,
  updateEmployeeType,
  deleteEmployeeType
};
