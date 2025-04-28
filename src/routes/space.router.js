import express from 'express';
import * as spaceController from '../controllers/space.controller.js';
import spaceTypeRouter from './space-type.router.js';

const router = express.Router();

router.use('/types', spaceTypeRouter);

router.get('/', spaceController.getSpaces);
router.get('/:spaceId', spaceController.getSpace);
router.post('/', spaceController.createSpace);
router.patch('/:spaceId', spaceController.updateSpace);
router.delete('/:spaceId', spaceController.deleteSpace);

export default router;
