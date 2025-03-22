import express from 'express';
import * as productTypeController from '../controllers/product-type.controller.js';

const router = express.Router();

router.get('/', productTypeController.getAllProductTypes);
router.get('/:typeId', productTypeController.getProductType);
router.post('/', productTypeController.createProductType);
router.patch('/:typeId', productTypeController.updateProductType);
router.delete('/:typeId', productTypeController.deleteProductType);

export default router;
