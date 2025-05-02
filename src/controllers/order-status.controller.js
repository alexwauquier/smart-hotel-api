import * as orderStatusModel from '../models/order-status.model.js';

const getAllOrderStatuses = async (req, res) => {
  try {
    const orderStatuses = await orderStatusModel.getAllOrderStatuses();

    if (!orderStatuses.length) {
      return res.status(404).json({
        success: false,
        error:  {
          code: 404,
          message: 'No order statuses found'
        }
      });
    }

    res.status(200).json(orderStatuses);
  } catch (err) {
    res.status(500).json({
      success: false,
      error:  {
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
        error:  {
          code: 404,
          message: 'Order status not found'
        }
      });
    }

    res.status(200).json(orderStatus);
  } catch (err) {
    res.status(500).json({
      success: false,
      error:  {
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

    const newOrderStatus = await orderStatusModel.createOrderStatus(
      { id, label }
    );

    res.status(201).json(newOrderStatus);
  } catch (err) {
    res.status(500).json({
      success: false,
      error:  {
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
      statusId, { id, label }
    );

    if (!updatedOrderStatus) {
      return res.status(404).json({
        success: false,
        error:  {
          code: 404,
          message: 'Order status not found'
        }
      });
    }

    res.status(200).json(updatedOrderStatus);
  } catch (err) {
    res.status(500).json({
      success: false,
      error:  {
        code: 500,
        message: err.message
      }
    });
  }
};

const deleteOrderStatus = async (req, res) => {
  try {
    const { statusId } = req.params;

    const deletedOrderStatus = await orderStatusModel.deleteOrderStatus(
      statusId
    );

    if (!deletedOrderStatus) {
      return res.status(404).json({
        success: false,
        error:  {
          code: 404,
          message: 'Order status not found'
        }
      });
    }

    res.status(200).json(deletedOrderStatus);
  } catch (err) {
    res.status(500).json({
      success: false,
      error:  {
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
