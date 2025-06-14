import * as productTypeModel from '../models/product-type.model.js';

const getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await productTypeModel.getAllProductTypes();

    if (!productTypes.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No product types found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        product_types: productTypes
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

const getProductType = async (req, res) => {
  try {
    const { typeId } = req.params;

    const productType = await productTypeModel.getProductTypeById(typeId);

    if (!productType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Product type not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        product_type: productType
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

const createProductType = async (req, res) => {
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

    const newProductType = await productTypeModel.createProductType({
      id,
      label
    });

    return res.status(201).json({
      success: true,
      data: {
        product_type: newProductType
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

const updateProductType = async (req, res) => {
  try {
    const { typeId } = req.params;
    const { id, label } = req.body;

    const updatedProductType = await productTypeModel.updateProductType(
      typeId,
      {
        id,
        label
      }
    );

    if (!updatedProductType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Product type not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        product_type: updatedProductType
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

const deleteProductType = async (req, res) => {
  try {
    const { typeId } = req.params;

    const deletedProductType = await productTypeModel.deleteProductType(typeId);

    if (!deletedProductType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Product type not found'
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product type successfully deleted'
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
  getAllProductTypes,
  getProductType,
  createProductType,
  updateProductType,
  deleteProductType
};
