import * as customerModel from '../models/customer.model.js';
import * as orderHeaderModel from '../models/order-header.model.js';
import * as orderStatusModel from '../models/order-status.model.js';
import * as spaceModel from '../models/space.model.js';

const getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 50;
    const spaceId = parseInt(req.query.space_id) || null;
    const sortBy = req.query.sort_by || 'id';
    const sortOrder =
      req.query.sort_order?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const offset = (page - 1) * size;

    const customers = await customerModel.getCustomers(
      size,
      offset,
      spaceId,
      sortBy,
      sortOrder
    );

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

    const baseUrl = process.env.API_BASE_URL;
    const spaceParam = spaceId ? `&space_id=${spaceId}` : '';

    const totalCustomers = await customerModel.countCustomers(spaceId);
    const totalPages = Math.ceil(totalCustomers / size);

    const sortByParam = sortBy ? `&sort_by=${sortBy}` : '';
    const sortOrderParam = sortOrder ? `&sort_order=${sortOrder}` : '';

    const buildLink = (targetPage) =>
      `${baseUrl}/api/customers?page=${targetPage}&size=${size}${spaceParam}${sortByParam}${sortOrderParam}`;

    const links = {
      first: buildLink(1),
      last: buildLink(totalPages),
      prev: page > 1 ? buildLink(page - 1) : null,
      next: page < totalPages ? buildLink(page + 1) : null
    };

    return res.status(200).json({
      success: true,
      meta: {
        page: {
          current: page,
          size,
          total: totalPages
        },
        total_items: totalCustomers
      },
      links,
      data: {
        customers: customersData
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
        }
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
        orders: customerOrdersData
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

const createCustomer = async (req, res) => {
  try {
    const {
      first_name: firstName,
      last_name: lastName,
      arrival_date: arrivalDate,
      departure_date: departureDate,
      space_id: spaceId
    } = req.body;

    if (!firstName || !lastName || !arrivalDate || !departureDate || !spaceId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Required fields missing'
        }
      });
    }

    const newCustomer = await customerModel.createCustomer({
      firstName,
      lastName,
      arrivalDate,
      departureDate,
      spaceId
    });

    const space = await spaceModel.getSpaceById(newCustomer.space_id);

    return res.status(201).json({
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
    return res.status(500).json({
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
    const {
      first_name: firstName,
      last_name: lastName,
      arrival_date: arrivalDate,
      departure_date: departureDate,
      space_id: spaceId
    } = req.body;

    const updatedCustomer = await customerModel.updateCustomer(customerId, {
      firstName,
      lastName,
      arrivalDate,
      departureDate,
      spaceId
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

    return res.status(200).json({
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
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: 'Customer successfully deleted'
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
  getCustomers,
  getCustomer,
  getCustomerOrders,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
