import * as spaceModel from '../models/space.model.js';

const getAllSpaces = async (req, res) => {
  try {
    const spaces = await spaceModel.getAllSpaces();

    if (!spaces) {
      return res.status(404).json({ error: 'No spaces found' });
    }

    res.json(spaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const space = await spaceModel.getSpaceById(spaceId);

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSpace = async (req, res) => {
  try {
    const { id, name, type_id: typeId, capacity } = req.body;

    const newSpace = await spaceModel.createSpace({
      id,
      name,
      typeId,
      capacity
    });

    res.status(201).json(newSpace);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      return res.status(404).json({ error: 'Space not found' });
    }

    res.status(200).json(updatedSpace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const deletedSpace = await spaceModel.deleteSpace(spaceId);

    if (!deletedSpace) {
      return res.status(404).json({ error: 'Space not found' });
    }

    res.status(200).json(deletedSpace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getAllSpaces,
  getSpace,
  createSpace,
  updateSpace,
  deleteSpace
};
