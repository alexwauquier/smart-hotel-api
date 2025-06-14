import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import * as customerModel from '../models/customer.model.js';
import * as employeeModel from '../models/employee.model.js';
import * as employeeTypeModel from '../models/employee-type.model.js';
import * as spaceModel from '../models/space.model.js';

const loginCustomer = async (req, res) => {
  try {
    const { last_name: lastName, space_id: spaceId } = req.body;

    if (!lastName || !spaceId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Missing last_name or space_id'
        }
      });
    }

    const customer = await customerModel.getCustomerByCredentials(
      lastName,
      spaceId
    );

    if (!customer) {
      return res.status(401).json({
        success: false,
        error: {
          code: 401,
          message: 'Invalid last name or room number'
        }
      });
    }

    const token = jwt.sign(
      { id: customer.id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const space = await spaceModel.getSpaceById(customer.space_id);

    return res.status(200).json({
      success: true,
      data: {
        customer: {
          id: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          arrival_date: customer.arrival_date,
          departure_date: customer.departure_date,
          space: {
            id: space.id,
            name: space.name
          }
        },
        token
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

const loginEmployee = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Missing username or password'
        }
      });
    }

    const employee = await employeeModel.getEmployeeByUsername(username);

    if (!employee) {
      return res.status(401).json({
        success: false,
        error: {
          code: 401,
          message: 'Invalid username'
        }
      });
    }

    const isValidPassword = await argon2.verify(
      employee.password_hash,
      password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 401,
          message: 'Invalid password'
        }
      });
    }

    const token = jwt.sign(
      { id: employee.id, role: 'employee', type_id: employee.type_id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const employeeType = await employeeTypeModel.getEmployeeTypeById(
      employee.type_id
    );

    return res.status(200).json({
      success: true,
      data: {
        employee: {
          id: employee.id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          type: {
            id: employeeType.id,
            label: employeeType.label
          }
        },
        token
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

export { loginCustomer, loginEmployee };
