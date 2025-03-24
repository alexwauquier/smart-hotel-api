import express from 'express';
import * as spaceTypeController from '../controllers/space-type.controller.js';

const router = express.Router();

router.get('/', spaceTypeController.getAllSpaceTypes);
router.get('/:spaceId', spaceTypeController.getSpaceType);
router.post('/', spaceTypeController.createSpaceType);
router.patch('/:spaceId', spaceTypeController.updateSpaceType);
router.delete('/:spaceId', spaceTypeController.deleteSpaceType);

export default router;
