import * as Product from '../models/product.js';

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, type_id, unit_price, stock_quantity, limit_quantity } = req.body;
    const newProduct = await Product.create({
      name,
      description,
      type_id,
      unit_price,
      stock_quantity,
      limit_quantity
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getAllProducts, getProduct, createProduct };
