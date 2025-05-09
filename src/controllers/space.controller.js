import * as spaceModel from '../models/space.model.js';
import * as spaceTypeModel from '../models/space-type.model.js';

const getSpaces = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 50;
    const typeId = req.query.type_id || null;
    const capacity = parseInt(req.query.capacity) || null;
    const offset = (page - 1) * size;

    const spaces = await spaceModel.getSpaces(size, offset, typeId, capacity);

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

    const baseUrl = process.env.API_BASE_URL;
    const typeParam = typeId ? `&type_id=${typeId}` : '';
    const capacityParam = capacity ? `&capacity=${capacity}` : '';

    const totalSpaces = await spaceModel.countSpaces(typeId, capacity);
    const totalPages = Math.ceil(totalSpaces / size);

    const buildLink = (targetPage) =>
      `${baseUrl}/api/spaces?page=${targetPage}&size=${size}${typeParam}${capacityParam}`;

    const links = {
      first: buildLink(1),
      last: buildLink(totalPages),
      prev: page > 1 ? buildLink(page - 1) : null,
      next: page < totalPages ? buildLink(page + 1) : null
    };

    res.status(200).json({
      success: true,
      meta: {
        page: {
          current: page,
          size,
          total: totalPages
        },
        total_items: totalSpaces
      },
      links,
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
