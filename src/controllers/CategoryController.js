const { Category } = require('../models/CategoryModel');
const { Op } = require('sequelize'); // Importar operadores de Sequelize

const get = async (request, response) => {
  const { nombre, descripcion } = request.query;  
  const filters = {};

  // Búsqueda por nombre (parcial, insensible a mayúsculas/minúsculas)
  if (nombre) {
    filters.nombre = { [Op.like]: `%${nombre}%` };
  }

  // Búsqueda por descripción (parcial, insensible a mayúsculas/minúsculas)
  if (descripcion) {
    filters.descripcion = { [Op.like]: `%${descripcion}%` };
  }

  try {
    const categories = await Category.findAll({ where: filters });
    response.json(categories);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error consultando las categorías' });
  }
};

const getById = async (request, response) => {
  const id = request.params.id;
  try {
    const category = await Category.findByPk(id);
    if (category) {
      response.json(category);
    } else {
      response.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al consultar la categoría' });
  }
};

const create = async (request, response) => {
  try {
    const newCategory = await Category.create(request.body);
    response.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    // Manejar errores de validación (ej. nombre duplicado)
    if (err.name === 'SequelizeUniqueConstraintError') {
      return response.status(409).json({ message: 'Ya existe una categoría con ese nombre.' });
    }
    response.status(500).json({ message: 'Error al crear la categoría' });
  }
};

const update = async (request, response) => {
  const id = request.params.id;
  try {
    const [numRowsUpdated] = await Category.update(request.body, {
      where: { id: id },
    });

    if (numRowsUpdated === 1) {
      response.status(200).json({ message: 'Categoría actualizada correctamente' });
    } else {
      response.status(404).json({ message: 'No se encontró la categoría para actualizar' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al actualizar la categoría' });
  }
};

const destroy = async (request, response) => {
  const id = request.params.id;
  try {
    const numRowsDeleted = await Category.destroy({
      where: { id: id },
    });

    if (numRowsDeleted === 1) {
      response.status(200).json({ message: 'Categoría eliminada correctamente' });
    } else {
      response.status(404).json({ message: 'No se encontró la categoría para eliminar' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al eliminar la categoría' });
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  destroy,
};