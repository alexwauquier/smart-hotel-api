import * as customerModel from '../models/customer.model.js';

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.getAllCustomers();

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
    const customer = await customerModel.getCustomerById(req.params.id);

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

    const newCustomer = await customerModel.createCustomer({
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

    const updatedCustomer = await customerModel.updateCustomer(id, {
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
    const deletedCustomer = await customerModel.deleteCustomer(id);

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
