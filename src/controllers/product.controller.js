import * as productModel from '../models/product.model.js';
import * as productTypeModel from '../models/product-type.model.js';

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 50;
    const typeId = parseInt(req.query.type_id) || null;
    const containsAlcohol = parseInt(req.query.contains_alcohol) || null;
    const offset = (page - 1) * size;

    const products = await productModel.getProducts(
      size,
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
          id: product.id,
          name: product.name,
          description: product.description,
          ingredients: product.ingredients,
          type: {
            id: productType.id,
            label: productType.label
          },
          contains_alcohol: product.contains_alcohol,
          unit_price: product.unit_price,
          stock_quantity: product.stock_quantity,
          limit_quantity: product.limit_quantity,
          image_url: product.image_url
        };
      })
    );

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const typeParam = typeId ? `&type_id=${typeId}` : '';
    const containsAlcoholParam = containsAlcohol ? `&contains_alcohol=${containsAlcohol}` : '';

    const totalProducts = await productModel.countProducts(typeId, containsAlcohol);
    const totalPages = Math.ceil(totalProducts / size);

    const buildLink = (targetPage) =>
      `${baseUrl}?page=${targetPage}&size=${size}${typeParam}${containsAlcoholParam}`;

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
        }
      },
      links,
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

    res.status(200).json({
      success: true,
      data: {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          ingredients: product.ingredients,
          type: {
            id: productType.id,
            label: productType.label
          },
          contains_alcohol: product.contains_alcohol,
          unit_price: product.unit_price,
          stock_quantity: product.stock_quantity,
          limit_quantity: product.limit_quantity,
          image_url: product.image_url
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
      limit_quantity: limitQuantity,
      image_url: imageUrl
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
      limitQuantity,
      imageUrl
    });

    const productType = await productTypeModel.getProductTypeById(
      newProduct.type_id
    );

    res.status(201).json({
      success: true,
      data: {
        product: {
          id: newProduct.id,
          name: newProduct.name,
          description: newProduct.description,
          ingredients: newProduct.ingredients,
          type: {
            id: productType.id,
            label: productType.label
          },
          contains_alcohol: newProduct.contains_alcohol,
          unit_price: newProduct.unit_price,
          stock_quantity: newProduct.stock_quantity,
          limit_quantity: newProduct.limit_quantity,
          image_url: newProduct.image_url
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
      limit_quantity: limitQuantity,
      image_url: imageUrl
    } = req.body;

    const updatedProduct = await productModel.updateProduct(productId, {
      name,
      description,
      ingredients,
      typeId,
      containsAlcohol,
      unitPrice,
      stockQuantity,
      limitQuantity,
      imageUrl
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

    res.status(200).json({
      success: true,
      data: {
        product: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          description: updatedProduct.description,
          ingredients: updatedProduct.ingredients,
          type: {
            id: productType.id,
            label: productType.label
          },
          contains_alcohol: updatedProduct.contains_alcohol,
          unit_price: updatedProduct.unit_price,
          stock_quantity: updatedProduct.stock_quantity,
          limit_quantity: updatedProduct.limit_quantity,
          image_url: updatedProduct.image_url
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
