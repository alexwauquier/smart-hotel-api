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

    res.status(200).json(productTypes);
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

    res.status(200).json(productType);
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

    res.status(201).json(newProductType);
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

    res.status(200).json(updatedProductType);
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

    res.status(200).json(deletedProductType);
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
  getAllProductTypes,
  getProductType,
  createProductType,
  updateProductType,
  deleteProductType
};
