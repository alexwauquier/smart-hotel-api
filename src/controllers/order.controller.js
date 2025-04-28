import * as orderHeaderModel from '../models/order-header.model.js';
import * as orderLineModel from '../models/order-line.model.js';
import pool from '../config/db.js';

const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 50, status_id: statusId } = req.query;
    const offset = (page - 1) * limit;

    const orders = await orderHeaderModel.getOrderHeaders(limit, offset, statusId);

    if (!orders.length) {
      return res.status(404).json({ error: 'No orders found' });
    }

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderHeader = await orderHeaderModel.getOrderHeaderById(orderId);

    if (!orderHeader) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderLines = await orderLineModel.getOrderLinesByOrderId(orderId);

    res.status(200).json({ order_header: orderHeader, order_lines: orderLines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const { customer_id: customerId, space_id: spaceId, items } = req.body;
    const orderLines = [];

    await client.query('BEGIN');

    const orderHeader = await orderHeaderModel.createOrderHeader(
      client, customerId, spaceId
    );

    for (const item of items) {
      const orderLine = await orderLineModel.createOrderLine(
        client, orderHeader.id, item.product_id, item.quantity
      );
      orderLines.push(orderLine);
    }

    await client.query('COMMIT');

    res.status(201).json({
      order_header: orderHeader,
      order_lines: orderLines
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await orderHeaderModel.updateOrderStatus(
      orderId, status
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getOrders, getOrderDetails, createOrder, updateOrderStatus };
