import * as orderStatusModel from '../models/order-status.model.js';

const getAllOrderStatuses = async (req, res) => {
  try {
    const orderStatuses = await orderStatusModel.getAllOrderStatuses();

    if (!orderStatuses.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No order statuses found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        order_statuses: orderStatuses
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

const getOrderStatus = async (req, res) => {
  try {
    const { statusId } = req.params;

    const orderStatus = await orderStatusModel.getOrderStatusById(statusId);

    if (!orderStatus) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Order status not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        order_status: orderStatus
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

const createOrderStatus = async (req, res) => {
  try {
    const { id, label } = req.body;

    if (!id || !label) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Missing id or label'
        }
      });
    }

    const newOrderStatus = await orderStatusModel.createOrderStatus({
      id,
      label
    });

    return res.status(201).json({
      success: true,
      data: {
        order_status: newOrderStatus
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

const updateOrderStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const { id, label } = req.body;

    const updatedOrderStatus = await orderStatusModel.updateOrderStatus(
      statusId,
      { id, label }
    );

    if (!updatedOrderStatus) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Order status not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        order_status: updatedOrderStatus
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

const deleteOrderStatus = async (req, res) => {
  try {
    const { statusId } = req.params;

    const deletedOrderStatus =
      await orderStatusModel.deleteOrderStatus(statusId);

    if (!deletedOrderStatus) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Order status not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status successfully deleted'
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
  getAllOrderStatuses,
  getOrderStatus,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus
};
