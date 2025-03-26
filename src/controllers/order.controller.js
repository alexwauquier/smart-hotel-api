import * as orderHeaderModel from '../models/order-header.model.js';
import * as orderLineModel from '../models/order-line.model.js';

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderHeaderModel.getAllOrderHeaders();

    if (!orders) {
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
  try {
    const { customer_id: customerId, items } = req.body;
    const orderLines = [];

    const orderHeader = await orderHeaderModel.createOrderHeader(customerId);

    for (const item of items) {
      const orderLine = await orderLineModel.createOrderLine(
        orderHeader.id, item.product_id, item.quantity
      );
      orderLines.push(orderLine);
    }

    res.status(201).json({
      order_header: orderHeader,
      order_lines: orderLines
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getAllOrders, getOrderDetails, createOrder };
