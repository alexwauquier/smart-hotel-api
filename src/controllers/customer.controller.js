import * as customerModel from '../models/customer.model.js';
import * as orderHeaderModel from '../models/order-header.model.js';
import * as orderStatusModel from '../models/order-status.model.js';
import * as spaceModel from '../models/space.model.js';

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

    const customersData = await Promise.all(
      customers.map(async (customer) => {
        const space = await spaceModel.getSpaceById(customer.space_id);
        return {
          id: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          arrival_date: customer.arrival_date,
          departure_date: customer.departure_date,
          space: {
            id: space.id,
            name: space.name
          }
        };
      })
    );

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const spaceParam = spaceId ? `&space_id=${spaceId}` : '';

    const totalCustomers = await customerModel.countCustomers(spaceId);
    const totalPages = Math.ceil(totalCustomers / limit);

    const buildLink = (targetPage) =>
      `${baseUrl}?page=${targetPage}&limit=${limit}${spaceParam}`;

    const links = {
      first: buildLink(1),
      last: buildLink(totalPages),
      prev: page > 1 ? buildLink(parseInt(page) - 1) : null,
      next: page < totalPages ? buildLink(parseInt(page) + 1) : null
    };

    res.status(200).json({
      success: true,
      meta: {
        page: {
          current: page,
          size: limit,
          total: totalPages
        }
      },
      links,
      data: {
        customers: customersData
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

    const space = await spaceModel.getSpaceById(customer.space_id);

    res.status(200).json({
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
        }
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

    const customerOrdersData = await Promise.all(
      orders.map(async (order) => {
        const orderStatus = await orderStatusModel.getOrderStatusById(
          order.status_id
        );
        const space = await spaceModel.getSpaceById(order.space_id);

        return {
          id: order.id,
          date: order.date,
          space: {
            id: space.id,
            name: space.name
          },
          status: {
            id: orderStatus.id,
            label: orderStatus.label
          },
          is_paid: order.is_paid
        };
      })
    );

    const customer = await customerModel.getCustomerById(customerId);
    const space = await spaceModel.getSpaceById(customer.space_id);

    res.status(200).json({
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
        orders: customerOrdersData
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

    const space = await spaceModel.getSpaceById(newCustomer.space_id);

    res.status(201).json({
      success: true,
      data: {
        customer: {
          id: newCustomer.id,
          first_name: newCustomer.first_name,
          last_name: newCustomer.last_name,
          arrival_date: newCustomer.arrival_date,
          departure_date: newCustomer.departure_date,
          space: {
            id: space.id,
            name: space.name
          }
        }
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

    const space = await spaceModel.getSpaceById(updatedCustomer.space_id);

    res.status(200).json({
      success: true,
      data: {
        customer: {
          id: updatedCustomer.id,
          first_name: updatedCustomer.first_name,
          last_name: updatedCustomer.last_name,
          arrival_date: updatedCustomer.arrival_date,
          departure_date: updatedCustomer.departure_date,
          space: {
            id: space.id,
            name: space.name
          }
        }
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

    res.status(200).json({
      success: true,
      message: 'Customer successfully deleted'
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
  getCustomers,
  getCustomer,
  getCustomerOrders,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
