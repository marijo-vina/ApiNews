const { check, body } = require('express-validator');
const { Profile } = require('../models/ProfileModel');

const validatorProfileCreate = [
  check('nombre')
    .notEmpty().withMessage('El campo nombre es obligatorio')
    .isString().withMessage('El campo nombre debe ser texto')
    .isLength({ min: 3, max: 50 }).withMessage('El campo nombre debe tener entre 3 y 50 caracteres')
    .custom(async (value) => {
      const profile = await Profile.findOne({ where: { nombre: value } });
      if (profile) {
        throw new Error('Ya existe un perfil con ese nombre');
      }
    }),
];

const validatorProfileUpdate = [
  body('id').not().exists().withMessage('No se puede modificar el ID'),
  check('nombre')
    .optional()
    .isString().withMessage('El campo nombre debe ser texto')
    .isLength({ min: 3, max: 50 }).withMessage('El campo nombre debe tener entre 3 y 50 caracteres')
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const profile = await Profile.findOne({ where: { nombre: value } });
      // Si encuentra un perfil con ese nombre y el ID es diferente al que se está actualizando
      if (profile && profile.id !== parseInt(id)) {
        throw new Error('Ya existe un perfil con ese nombre');
      }
    }),
];

module.exports = {
  validatorProfileCreate,
  validatorProfileUpdate,
};