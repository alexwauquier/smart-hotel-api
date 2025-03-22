import * as productTypeModel from '../models/product-type.model.js';

const getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await productTypeModel.getAllProductTypes();

    if (!productTypes) {
      return res.status(404).json({ error: 'No product types found' });
    }

    res.json(productTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductType = async (req, res) => {
  try {
    const { typeId } = req.params;

    const productType = await productTypeModel.getProductTypeById(
      typeId
    );

    if (!productType) {
      return res.status(404).json({ error: 'Product type not found' });
    }

    res.status(200).json(productType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProductType = async (req, res) => {
  try {
    const { id, label } = req.body;

    const newProductType = await productTypeModel.createProductType({
      id,
      label
    });

    res.status(201).json(newProductType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProductType = async (req, res) => {
  try {
    const { typeId } = req.params;
    const { id, label } = req.body;

    const updatedProductType = await productTypeModel.updateProductType(
      typeId, {
        id,
        label
      }
    );

    if (!updatedProductType) {
      return res.status(404).json({ error: 'Product type not found' });
    }

    res.status(200).json(updatedProductType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProductType = async (req, res) => {
  try {
    const { typeId } = req.params;

    const deletedProductType = await productTypeModel.deleteProductType(
      typeId
    );

    if (!deletedProductType) {
      return res.status(404).json({ error: 'Product type not found' });
    }

    res.status(200).json(deletedProductType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getAllProductTypes,
  getProductType,
  createProductType,
  updateProductType,
  deleteProductType
};
