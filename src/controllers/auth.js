import jwt from 'jsonwebtoken';
import * as Customer from '../models/customer.js';

const loginCustomer = async (req, res) => {
  try {
    const { last_name, space_id } = req.body;
    const customer = await Customer.findByCredentials(last_name, space_id);

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

export { loginCustomer };
