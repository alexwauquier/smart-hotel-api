import * as Customer from '../models/customer.js';

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();

    if (!customers) {
      return res.status(404).json({ error: 'No customers found' })
    }

    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { first_name, last_name, arrival_date, departure_date, space_id } = req.body;

    const newCustomer = await Customer.create({
      first_name,
      last_name,
      arrival_date,
      departure_date,
      space_id
    });

    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, arrival_date, departure_date, space_id } = req.body;

    const updatedCustomer = await Customer.update(id, {
      first_name,
      last_name,
      arrival_date,
      departure_date,
      space_id
    });

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    res.status(200).json(updatedCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.deleteById(id);

    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    res.status(200).json(deletedCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export { getAllCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
