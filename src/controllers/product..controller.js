import * as productModel from '../models/product.model.js';

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();

    if (!products) {
      return res.status(404).json({ error: 'No products found' })
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, ingredients, type_id, contains_alcohol, unit_price, stock_quantity, limit_quantity } = req.body;
    const newProduct = await productModel.createProduct({
      name,
      description,
      ingredients,
      type_id,
      contains_alcohol,
      unit_price,
      stock_quantity,
      limit_quantity
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, ingredients, type_id, contains_alcohol, unit_price, stock_quantity, limit_quantity } = req.body;

    const updatedProduct = await productModel.updateProduct(productId, {
      name,
      description,
      ingredients,
      type_id,
      contains_alcohol,
      unit_price,
      stock_quantity,
      limit_quantity
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await productModel.deleteProduct(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json(deletedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct };
