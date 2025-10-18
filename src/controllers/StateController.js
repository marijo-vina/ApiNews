const { State } = require('../models/StateModel');
const { Op } = require('sequelize');

const get = async (request, response) => {
  const { nombre, abreviacion } = request.query;
  const filters = {};

  if (nombre) {
    filters.nombre = { [Op.like]: `%${nombre}%` };
  }

  if (abreviacion) {
    filters.abreviacion = { [Op.like]: `%${abreviacion}%` };
  }

  try {
    const states = await State.findAll({ where: filters });
    response.json(states);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error consultando los estados' });
  }
};

const getById = async (request, response) => {
  const id = request.params.id;
  try {
    const state = await State.findByPk(id);
    if (state) {
      response.json(state);
    } else {
      response.status(404).json({ message: 'Estado no encontrado' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al consultar el estado' });
  }
};

const create = async (request, response) => {
  try {
    const newState = await State.create(request.body);
    response.status(201).json(newState);
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return response.status(409).json({ message: 'Ya existe un estado con ese nombre o abreviación.' });
    }
    response.status(500).json({ message: 'Error al crear el estado' });
  }
};

const update = async (request, response) => {
  const id = request.params.id;
  try {
    const [numRowsUpdated] = await State.update(request.body, {
      where: { id: id },
    });

    if (numRowsUpdated === 1) {
      response.status(200).json({ message: 'Estado actualizado correctamente' });
    } else {
      response.status(404).json({ message: 'No se encontró el estado para actualizar' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al actualizar el estado' });
  }
};

const destroy = async (request, response) => {
  const id = request.params.id;
  try {
    const numRowsDeleted = await State.destroy({
      where: { id: id },
    });

    if (numRowsDeleted === 1) {
      response.status(200).json({ message: 'Estado eliminado correctamente' });
    } else {
      response.status(404).json({ message: 'No se encontró el estado para eliminar' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al eliminar el estado' });
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  destroy,
};