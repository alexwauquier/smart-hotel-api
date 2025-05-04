import * as productModel from '../models/product.model.js';

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      type_id: typeId,
      contains_alcohol: containsAlcohol
    } = req.query;
    const offset = (page - 1) * limit;

    const products = await productModel.getProducts(
      limit,
      offset,
      typeId,
      containsAlcohol
    );

    if (!products.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No products found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        products: products
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

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Product not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        product
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

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      ingredients,
      type_id: typeId,
      contains_alcohol: containsAlcohol,
      unit_price: unitPrice,
      stock_quantity: stockQuantity,
      limit_quantity: limitQuantity
    } = req.body;

    if (!name || !typeId || !containsAlcohol || !unitPrice) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Required fields missing'
        }
      });
    }

    const newProduct = await productModel.createProduct({
      name,
      description,
      ingredients,
      typeId,
      containsAlcohol,
      unitPrice,
      stockQuantity,
      limitQuantity
    });

    res.status(201).json({
      success: true,
      data: {
        product: newProduct
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

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      name,
      description,
      ingredients,
      type_id: typeId,
      contains_alcohol: containsAlcohol,
      unit_price: unitPrice,
      stock_quantity: stockQuantity,
      limit_quantity: limitQuantity
    } = req.body;

    const updatedProduct = await productModel.updateProduct(productId, {
      name,
      description,
      ingredients,
      typeId,
      containsAlcohol,
      unitPrice,
      stockQuantity,
      limitQuantity
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Product not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        product: updatedProduct
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

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await productModel.deleteProduct(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Product not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product successfully deleted'
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

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
