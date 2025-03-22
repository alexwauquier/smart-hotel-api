import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import * as customerModel from '../models/customer.model.js';
import * as employeeModel from '../models/employee.model.js';

const loginCustomer = async (req, res) => {
  try {
    const { last_name, space_id } = req.body;

    const customer = await customerModel.getCustomerByCredentials(
      last_name,
      space_id
    );

    if (!customer) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign(
      { id: customer.id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, customer: {
      id: customer.id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      arrival_date: customer.arrival_date,
      departure_date: customer.departure_date,
      space_id: customer.space_id
    } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const loginEmployee = async (req, res) => {
  try {
    const { username, password } = req.body;

    const employee = await employeeModel.getEmployeeByUsername(username);

    if (!employee) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const isValidPassword = await argon2.verify(
      employee.password_hash,
      password
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign(
      { id: employee.id, role: 'employee', type_id: employee.type_id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, employee: {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      type_id: employee.type_id
    } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export { loginCustomer, loginEmployee };
