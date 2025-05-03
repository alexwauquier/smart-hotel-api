import * as customerModel from '../models/customer.model.js';
import * as orderHeaderModel from '../models/order-header.model.js';

const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 50, space_id: spaceId } = req.query;
    const offset = (page - 1) * limit;

    const customers = await customerModel.getCustomers(limit, offset, spaceId);

    if (!customers.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No customers found'
        }
      });
    }

    res.status(200).json(customers);
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

const getCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await customerModel.getCustomerById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Customer not found'
        }
      });
    }

    res.status(200).json(customer);
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

const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await orderHeaderModel.getOrdersByCustomerId(customerId);

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No orders found'
        }
      });
    }

    res.status(200).json(orders);
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

const createCustomer = async (req, res) => {
  try {
    const { first_name, last_name, arrival_date, departure_date, space_id } =
      req.body;

    if (
      !first_name ||
      !last_name ||
      !arrival_date ||
      !departure_date ||
      !space_id
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Required fields missing'
        }
      });
    }

    const newCustomer = await customerModel.createCustomer({
      first_name,
      last_name,
      arrival_date,
      departure_date,
      space_id
    });

    res.status(201).json(newCustomer);
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

const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { first_name, last_name, arrival_date, departure_date, space_id } =
      req.body;

    const updatedCustomer = await customerModel.updateCustomer(customerId, {
      first_name,
      last_name,
      arrival_date,
      departure_date,
      space_id
    });

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Customer not found'
        }
      });
    }

    res.status(200).json(updatedCustomer);
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

const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const deletedCustomer = await customerModel.deleteCustomer(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Customer not found'
        }
      });
    }

    res.status(200).json(deletedCustomer);
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
  getCustomers,
  getCustomer,
  getCustomerOrders,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
