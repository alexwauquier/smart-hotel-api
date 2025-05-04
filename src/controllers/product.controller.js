import * as productModel from '../models/product.model.js';
import * as productTypeModel from '../models/product-type.model.js';

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

    const productsData = await Promise.all(
      products.map(async (product) => {
        const productType = await productTypeModel.getProductTypeById(
          product.type_id
        );
        return {
          ...product,
          type_label: productType.label
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        products: productsData
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

    const productType = await productTypeModel.getProductTypeById(
      product.type_id
    );

    const productData = {
      ...product,
      type_label: productType.label
    };

    res.status(200).json({
      success: true,
      data: {
        product: productData
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

    const productType = await productTypeModel.getProductTypeById(
      newProduct.type_id
    );

    const productData = {
      ...newProduct,
      type_label: productType.label
    };

    res.status(201).json({
      success: true,
      data: {
        product: productData
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

    const productType = await productTypeModel.getProductTypeById(
      updatedProduct.type_id
    );

    const productData = {
      ...updatedProduct,
      type_label: productType.label
    };

    res.status(200).json({
      success: true,
      data: {
        product: productData
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
