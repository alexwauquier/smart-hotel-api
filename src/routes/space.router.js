import express from 'express';
import * as spaceController from '../controllers/space.controller.js';

const router = express.Router();

router.get('/', spaceController.getAllSpaces);
router.get('/:spaceId', spaceController.getSpace);
router.post('/', spaceController.createSpace);
router.patch('/:spaceId', spaceController.updateSpace);
router.delete('/:spaceId', spaceController.deleteSpace);

export default router;
