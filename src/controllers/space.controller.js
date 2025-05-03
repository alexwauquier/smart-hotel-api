import * as spaceModel from '../models/space.model.js';

const getSpaces = async (req, res) => {
  try {
    const { page = 1, limit = 50, type_id: typeId, capacity } = req.query;
    const offset = (page - 1) * limit;

    const spaces = await spaceModel.getSpaces(limit, offset, typeId, capacity);

    if (!spaces.length) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'No spaces found'
        }
      });
    }

    res.status(200).json(spaces);
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

const getSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const space = await spaceModel.getSpaceById(spaceId);

    if (!space) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Space not found'
        }
      });
    }

    res.status(200).json(space);
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

const createSpace = async (req, res) => {
  try {
    const { id, name, type_id: typeId, capacity } = req.body;

    if (!id || !name || !typeId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'Required fields missing'
        }
      });
    }

    const newSpace = await spaceModel.createSpace({
      id,
      name,
      typeId,
      capacity
    });

    res.status(201).json(newSpace);
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

const updateSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { id, name, type_id: typeId, capacity } = req.body;

    const updatedSpace = await spaceModel.updateSpace(spaceId, {
      id,
      name,
      typeId,
      capacity
    });

    if (!updatedSpace) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Space not found'
        }
      });
    }

    res.status(200).json(updatedSpace);
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

const deleteSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const deletedSpace = await spaceModel.deleteSpace(spaceId);

    if (!deletedSpace) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Space not found'
        }
      });
    }

    res.status(200).json(deletedSpace);
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

export { getSpaces, getSpace, createSpace, updateSpace, deleteSpace };
