import * as orderHeaderModel from '../models/order-header.model.js';
import * as orderLineModel from '../models/order-line.model.js';
import * as orderStatusModel from '../models/order-status.model.js';
import * as spaceModel from '../models/space.model.js';
import pool from '../config/db.js';

const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 50, status_id: statusId } = req.query;
    const offset = (page - 1) * limit;

    const orders = await orderHeaderModel.getOrderHeaders(
      limit,
      offset,
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

        const space = await spaceModel.getSpaceById(order.space_id);

        return {
          id: order.id,
          date: order.date,
          customer_id: order.customer_id,
          employee_id: order.employee_id,
          space: {
            id: space.id,
            name: space.name
          },
          status_id: order.status_id,
          status_label: orderStatus.label,
          is_paid: order.is_paid
        };
      })
    );

    res.status(200).json({
      success: true,
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

    const orderLines = await orderLineModel.getOrderLinesByOrderId(orderId);

    const orderStatus = await orderStatusModel.getOrderStatusById(
      orderHeader.status_id
    );

    const space = await spaceModel.getSpaceById(orderHeader.space_id);

    res.status(200).json({
      success: true,
      data: {
        order: {
          id: orderHeader.id,
          date: orderHeader.date,
          customer_id: orderHeader.customer_id,
          employee_id: orderHeader.employee_id,
          space: {
            id: space.id,
            name: space.name
          },
          status_id: orderHeader.status_id,
          status_label: orderStatus.label,
          is_paid: orderHeader.is_paid,
          line_items: orderLines
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

    const orderStatus = await orderStatusModel.getOrderStatusById(
      orderHeader.status_id
    );

    const space = await spaceModel.getSpaceById(orderHeader.space_id);

    res.status(201).json({
      success: true,
      data: {
        order: {
          id: orderHeader.id,
          date: orderHeader.date,
          customer_id: orderHeader.customer_id,
          employee_id: orderHeader.employee_id,
          space: {
            id: space.id,
            name: space.name
          },
          status_id: orderHeader.status_id,
          status_label: orderStatus.label,
          is_paid: orderHeader.is_paid,
          line_items: orderLines
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

    const orderStatus = await orderStatusModel.getOrderStatusById(
      updatedOrder.status_id
    );

    const space = await spaceModel.getSpaceById(updatedOrder.space_id);

    res.status(200).json({
      success: true,
      data: {
        order: {
          id: updatedOrder.id,
          date: updatedOrder.date,
          customer_id: updatedOrder.customer_id,
          employee_id: updatedOrder.employee_id,
          space: {
            id: space.id,
            name: space.name
          },
          status_id: updatedOrder.status_id,
          status_label: orderStatus.label,
          is_paid: updatedOrder.is_paid
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
