import * as spaceModel from '../models/space.model.js';
import * as spaceTypeModel from '../models/space-type.model.js';

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

    const spacesData = await Promise.all(
      spaces.map(async (space) => {
        const spaceType = await spaceTypeModel.getSpaceTypeById(space.type_id);
        return {
          id: space.id,
          name: space.name,
          type: {
            id: spaceType.id,
            label: spaceType.label
          },
          capacity: space.capacity
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        spaces: spacesData
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

    const spaceType = await spaceTypeModel.getSpaceTypeById(space.type_id);

    res.status(200).json({
      success: true,
      data: {
        space: {
          id: space.id,
          name: space.name,
          type: {
            id: spaceType.id,
            label: spaceType.label
          },
          capacity: space.capacity
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

    const spaceType = await spaceTypeModel.getSpaceTypeById(newSpace.type_id);

    res.status(201).json({
      success: true,
      data: {
        space: {
          id: newSpace.id,
          name: newSpace.name,
          type: {
            id: spaceType.id,
            label: spaceType.label
          },
          capacity: newSpace.capacity
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

    const spaceType = await spaceTypeModel.getSpaceTypeById(
      updatedSpace.type_id
    );

    res.status(200).json({
      success: true,
      data: {
        space: {
          id: updatedSpace.id,
          name: updatedSpace.name,
          type: {
            id: spaceType.id,
            label: spaceType.label
          },
          capacity: updatedSpace.capacity
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

    res.status(200).json({
      success: true,
      message: 'Space successfully deleted'
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

export { getSpaces, getSpace, createSpace, updateSpace, deleteSpace };
