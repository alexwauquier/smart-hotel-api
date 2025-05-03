import * as spaceTypeModel from '../models/space-type.model.js';

const getAllSpaceTypes = async (req, res) => {
  try {
    const spaceTypes = await spaceTypeModel.getAllSpaceTypes();

    if (!spaceTypes.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No space types found'
        }
      });
    }

    res.status(200).json(spaceTypes);
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

const getSpaceType = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const spaceType = await spaceTypeModel.getSpaceTypeById(spaceId);

    if (!spaceType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Space type not found'
        }
      });
    }

    res.status(200).json(spaceType);
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

const createSpaceType = async (req, res) => {
  try {
    const { id, label } = req.body;

    if (!id || !label) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Missing id or label'
        }
      });
    }

    const newSpaceType = await spaceTypeModel.createSpaceType({ id, label });

    res.status(201).json(newSpaceType);
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

const updateSpaceType = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { id, label } = req.body;

    const updatedSpaceType = await spaceTypeModel.updateSpaceType(spaceId, {
      id,
      label
    });

    if (!updatedSpaceType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Space type not found'
        }
      });
    }

    res.status(200).json(updatedSpaceType);
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

const deleteSpaceType = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const deletedSpaceType = await spaceTypeModel.deleteSpaceType(spaceId);

    if (!deletedSpaceType) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Space type not found'
        }
      });
    }

    res.status(200).json(deletedSpaceType);
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

export {
  getAllSpaceTypes,
  getSpaceType,
  createSpaceType,
  updateSpaceType,
  deleteSpaceType
};
