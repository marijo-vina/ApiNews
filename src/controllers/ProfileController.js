const { Profile } = require('../models/ProfileModel');
const { Op } = require('sequelize'); // Importar operadores de Sequelize

// Convertido a async/await con try/catch para mejor legibilidad y manejo de errores.
const get = async (request, response) => {
  const { nombre } = request.query;
  const filters = {};

  if (nombre) {
    // Usamos Op.like para búsquedas parciales (ej. buscar "admin" y que encuentre "Administrador")
    filters.nombre = { [Op.like]: `%${nombre}%` };
  }

  try {
    const entities = await Profile.findAll({ where: filters });
    response.json(entities);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error consultando los perfiles' });
  }
};

// Convertido a async/await
const getById = async (request, response) => {
  const id = request.params.id;
  try {
    const entitie = await Profile.findByPk(id);
    if (entitie) {
      response.json(entitie);
    } else {
      response.status(404).json({ message: 'Perfil no encontrado' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al consultar el perfil' });
  }
};

// Convertido a async/await
const create = async (request, response) => {
  try {
    const newEntitie = await Profile.create(request.body);
    response.status(201).json(newEntitie);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al crear el perfil' });
  }
};

// Convertido a async/await y con mejor manejo de la respuesta.
const update = async (request, response) => {
  const id = request.params.id;
  try {
    const [numRowsUpdated] = await Profile.update(request.body, {
      where: { id: id },
    });

    if (numRowsUpdated === 1) {
      response.status(200).json({ message: 'Perfil actualizado correctamente' });
    } else {
      response.status(404).json({ message: 'No se encontró el perfil para actualizar' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

// Convertido a async/await y con mejor manejo de la respuesta.
const destroy = async (request, response) => {
  const id = request.params.id;
  try {
    const numRowsDeleted = await Profile.destroy({
      where: { id: id },
    });

    if (numRowsDeleted === 1) {
      response.status(200).json({ message: 'Perfil eliminado correctamente' });
    } else {
      response.status(404).json({ message: 'No se encontró el perfil para eliminar' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al eliminar el perfil' });
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  destroy,
};