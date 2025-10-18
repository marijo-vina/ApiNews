const { News } = require('../models/NewsModel');
const { Category } = require('../models/CategoryModel');
const { State } = require('../models/StateModel');
const { User } = require('../models/UserModel');
const { Op } = require('sequelize');

// Definimos un array con los modelos a incluir para no repetirlo
const includeModels = [
  { model: Category, as: 'categoria', attributes: ['nombre'] },
  { model: State, as: 'estado', attributes: ['nombre'] },
  { model: User, as: 'usuario', attributes: ['nombre', 'apellidos'] },
];

const get = async (request, response) => {
  const { titulo } = request.query;
  const filters = {};

  if (titulo) {
    filters.titulo = { [Op.like]: `%${titulo}%` };
  }

  try {
    const news = await News.findAll({
      where: filters,
      include: includeModels, // Eager loading de las asociaciones
    });
    response.json(news);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error consultando las noticias' });
  }
};

const getById = async (request, response) => {
  const id = request.params.id;
  try {
    const newsItem = await News.findByPk(id, {
      include: includeModels, // Eager loading de las asociaciones
    });
    if (newsItem) {
      response.json(newsItem);
    } else {
      response.status(404).json({ message: 'Noticia no encontrada' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al consultar la noticia' });
  }
};

const create = async (request, response) => {
  try {
    const newNewsItem = await News.create(request.body);
    response.status(201).json(newNewsItem);
  } catch (err) {
    console.error(err);
    // Manejar errores de validación (ej. foreign key que no existe)
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return response.status(409).json({ message: 'El id de categoría, estado o usuario no es válido.' });
    }
    response.status(500).json({ message: 'Error al crear la noticia' });
  }
};

const update = async (request, response) => {
  const id = request.params.id;
  try {
    const [numRowsUpdated] = await News.update(request.body, {
      where: { id: id },
    });

    if (numRowsUpdated === 1) {
      response.status(200).json({ message: 'Noticia actualizada correctamente' });
    } else {
      response.status(404).json({ message: 'No se encontró la noticia para actualizar' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al actualizar la noticia' });
  }
};

const destroy = async (request, response) => {
  const id = request.params.id;
  try {
    const numRowsDeleted = await News.destroy({
      where: { id: id },
    });

    if (numRowsDeleted === 1) {
      response.status(200).json({ message: 'Noticia eliminada correctamente' });
    } else {
      response.status(404).json({ message: 'No se encontró la noticia para eliminar' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al eliminar la noticia' });
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  destroy,
};
