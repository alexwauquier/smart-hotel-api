import * as customerModel from '../models/customer.model.js';
import * as employeeModel from '../models/employee.model.js';
import * as orderHeaderModel from '../models/order-header.model.js';
import * as orderLineModel from '../models/order-line.model.js';
import * as orderStatusModel from '../models/order-status.model.js';
import * as productModel from '../models/product.model.js';
import * as spaceModel from '../models/space.model.js';
import pool from '../config/db.js';

const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 50;
    const employeeId = req.query.employee_id;
    const statusId = req.query.status_id || null;
    const offset = (page - 1) * size;

    const orders = await orderHeaderModel.getOrderHeaders(
      size,
      offset,
      employeeId,
      statusId
    );

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No orders found'
        }
      });
    }

    const ordersData = await Promise.all(
      orders.map(async (order) => {
        const orderStatus = await orderStatusModel.getOrderStatusById(
          order.status_id
        );
        const customer = await customerModel.getCustomerById(order.customer_id);
        const employee = order.employee_id
          ? await employeeModel.getEmployeeById(order.employee_id)
          : null;
        const space = await spaceModel.getSpaceById(order.space_id);

        return {
          id: order.id,
          date: order.date,
          customer: {
            first_name: customer.first_name,
            last_name: customer.last_name,
            space_id: customer.space_id
          },
          employee: employee
            ? { first_name: employee.first_name, last_name: employee.last_name }
            : null,
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

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const statusParam = statusId ? `&status_id=${statusId}` : '';

    const totalOrders = await orderHeaderModel.countOrders(statusParam);
    const totalPages = Math.ceil(totalOrders / size);

    const buildLink = (targetPage) =>
      `${baseUrl}?page=${targetPage}&size=${size}${statusParam}`;

    const links = {
      first: buildLink(1),
      last: buildLink(totalPages),
      prev: page > 1 ? buildLink(page - 1) : null,
      next: page < totalPages ? buildLink(page + 1) : null
    };

    res.status(200).json({
      success: true,
      meta: {
        page: {
          current: page,
          size,
          total: totalPages
        },
        total_items: totalOrders
      },
      links,
      data: {
        orders: ordersData
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

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderHeader = await orderHeaderModel.getOrderHeaderById(orderId);

    if (!orderHeader) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Order not found'
        }
      });
    }

    const customer = await customerModel.getCustomerById(
      orderHeader.customer_id
    );
    const employee = orderHeader.employee_id
      ? await employeeModel.getEmployeeById(orderHeader.employee_id)
      : null;
    const space = await spaceModel.getSpaceById(orderHeader.space_id);
    const orderStatus = await orderStatusModel.getOrderStatusById(
      orderHeader.status_id
    );
    const orderLines = await orderLineModel.getOrderLinesByOrderId(orderId);

    const orderLinesData = await Promise.all(
      orderLines.map(async (orderLine) => {
        const product = await productModel.getProductById(orderLine.product_id);
        return {
          id: orderLine.id,
          product: {
            id: product.id,
            name: product.name,
            unit_price: product.unit_price
          },
          quantity: orderLine.product_quantity
        };
      })
    );

    const totalPrice = orderLinesData.reduce((total, line) => {
      return total + line.product.unit_price * line.quantity;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        order: {
          id: orderHeader.id,
          date: orderHeader.date,
          customer: {
            first_name: customer.first_name,
            last_name: customer.last_name,
            space_id: customer.space_id
          },
          employee: employee
            ? { first_name: employee.first_name, last_name: employee.last_name }
            : null,
          space: {
            id: space.id,
            name: space.name
          },
          status: {
            id: orderStatus.id,
            label: orderStatus.label
          },
          is_paid: orderHeader.is_paid,
          line_items: orderLinesData,
          total_price: totalPrice
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

const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const { customer_id: customerId, space_id: spaceId, items } = req.body;

    if (!customerId || !spaceId || !items) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Required fields missing'
        }
      });
    }

    const orderLines = [];

    await client.query('BEGIN');

    const orderHeader = await orderHeaderModel.createOrderHeader(
      client,
      customerId,
      spaceId
    );

    for (const item of items) {
      const orderLine = await orderLineModel.createOrderLine(
        client,
        orderHeader.id,
        item.product_id,
        item.quantity
      );
      orderLines.push(orderLine);
    }

    await client.query('COMMIT');

    const customer = await customerModel.getCustomerById(
      orderHeader.customer_id
    );
    const employee = orderHeader.employee_id
      ? await employeeModel.getEmployeeById(orderHeader.employee_id)
      : null;
    const space = await spaceModel.getSpaceById(orderHeader.space_id);
    const orderStatus = await orderStatusModel.getOrderStatusById(
      orderHeader.status_id
    );

    const orderLinesData = await Promise.all(
      orderLines.map(async (orderLine) => {
        const product = await productModel.getProductById(orderLine.product_id);
        return {
          id: orderLine.id,
          product: {
            id: product.id,
            name: product.name,
            unit_price: product.unit_price
          },
          quantity: orderLine.product_quantity
        };
      })
    );

    const totalPrice = orderLinesData.reduce((total, line) => {
      return total + line.product.unit_price * line.quantity;
    }, 0);

    res.status(201).json({
      success: true,
      data: {
        order: {
          id: orderHeader.id,
          date: orderHeader.date,
          customer: {
            first_name: customer.first_name,
            last_name: customer.last_name,
            space_id: customer.space_id
          },
          employee: employee
            ? { first_name: employee.first_name, last_name: employee.last_name }
            : null,
          space: {
            id: space.id,
            name: space.name
          },
          status: {
            id: orderStatus.id,
            label: orderStatus.label
          },
          is_paid: orderHeader.is_paid,
          line_items: orderLinesData,
          total_price: totalPrice
        }
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: err.message
      }
    });
  } finally {
    client.release();
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Missing status'
        }
      });
    }

    const updatedOrder = await orderHeaderModel.updateOrderStatus(
      orderId,
      status
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Order not found'
        }
      });
    }

    const customer = await customerModel.getCustomerById(
      updatedOrder.customer_id
    );
    const employee = updatedOrder.employee_id
      ? await employeeModel.getEmployeeById(updatedOrder.employee_id)
      : null;
    const space = await spaceModel.getSpaceById(updatedOrder.space_id);
    const orderStatus = await orderStatusModel.getOrderStatusById(
      updatedOrder.status_id
    );
    const orderLines = await orderLineModel.getOrderLinesByOrderId(orderId);

    const orderLinesData = await Promise.all(
      orderLines.map(async (orderLine) => {
        const product = await productModel.getProductById(orderLine.product_id);
        return {
          id: orderLine.id,
          product: {
            id: product.id,
            name: product.name,
            unit_price: product.unit_price
          },
          quantity: orderLine.product_quantity
        };
      })
    );

    const totalPrice = orderLinesData.reduce((total, line) => {
      return total + line.product.unit_price * line.quantity;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        order: {
          id: updatedOrder.id,
          date: updatedOrder.date,
          customer: {
            first_name: customer.first_name,
            last_name: customer.last_name,
            space_id: customer.space_id
          },
          employee: employee
            ? { first_name: employee.first_name, last_name: employee.last_name }
            : null,
          space: {
            id: space.id,
            name: space.name
          },
          status: {
            id: orderStatus.id,
            label: orderStatus.label
          },
          is_paid: updatedOrder.is_paid,
          line_items: orderLinesData,
          total_price: totalPrice
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

export { getOrders, getOrderDetails, createOrder, updateOrderStatus };
