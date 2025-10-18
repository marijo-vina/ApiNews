const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Incluimos el modelo de Perfil para obtener el nombre del perfil en las consultas
const includeProfile = {
  model: Profile,
  as: 'perfil',
  attributes: ['nombre'],
};

const get = async (request, response) => {
  const { nombre, correo } = request.query;
  const filters = {
    // Excluimos el campo 'password' de todas las consultas GET
    attributes: { exclude: ['password'] },
  };

  const where = {};
  if (nombre) {
    where.nombre = { [Op.like]: `%${nombre}%` };
  }
  if (correo) {
    where.correo = { [Op.like]: `%${correo}%` };
  }

  filters.where = where;
  filters.include = includeProfile;

  try {
    const users = await User.findAll(filters);
    response.json(users);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error consultando los usuarios' });
  }
};

const getById = async (request, response) => {
  const id = request.params.id;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: includeProfile,
    });
    if (user) {
      response.json(user);
    } else {
      response.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al consultar el usuario' });
  }
};

const create = async (request, response) => {
  const { body } = request;
  try {
    // Hashear la contraseña antes de crear el usuario
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }

    const newUser = await User.create(body);
    // No devolvemos el password en la respuesta
    const userJson = newUser.toJSON();
    delete userJson.password;

    response.status(201).json(userJson);
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return response.status(409).json({ message: 'Ya existe un usuario con ese correo.' });
    }
    response.status(500).json({ message: 'Error al crear el usuario' });
  }
};

const update = async (request, response) => {
  const id = request.params.id;
  const { body } = request;
  try {
    // Si se está actualizando la contraseña, hashearla
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }

    const [numRowsUpdated] = await User.update(body, { where: { id } });

    if (numRowsUpdated === 1) {
      response.status(200).json({ message: 'Usuario actualizado correctamente' });
    } else {
      response.status(404).json({ message: 'No se encontró el usuario para actualizar' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

const destroy = async (request, response) => {
  const id = request.params.id;
  try {
    const numRowsDeleted = await User.destroy({ where: { id } });

    if (numRowsDeleted === 1) {
      response.status(200).json({ message: 'Usuario eliminado correctamente' });
    } else {
      response.status(404).json({ message: 'No se encontró el usuario para eliminar' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

module.exports = { get, getById, create, update, destroy };