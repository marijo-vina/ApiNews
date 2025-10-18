const { check, body } = require('express-validator');
const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');

const validatorUserCreate = [
  check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser texto'),

  check('apellidos')
    .notEmpty().withMessage('Los apellidos son obligatorios')
    .isString().withMessage('Los apellidos deben ser texto'),

  check('correo')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo electrónico válido')
    .custom(async (value) => {
      const user = await User.findOne({ where: { correo: value } });
      if (user) {
        throw new Error('Ya existe un usuario con ese correo.');
      }
    }),

  check('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .isStrongPassword().withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo.'),

  check('perfil_id')
    .notEmpty().withMessage('El perfil es obligatorio')
    .isInt().withMessage('El ID de perfil debe ser un número')
    .custom(async (value) => {
      const profile = await Profile.findByPk(value);
      if (!profile) {
        throw new Error('El perfil especificado no existe.');
      }
    }),
];

const validatorUserUpdate = [
  body('id').not().exists().withMessage('No se puede modificar el ID'),
  check('nombre').optional().isString(),
  check('apellidos').optional().isString(),
  check('correo')
    .optional()
    .isEmail().withMessage('Debe ser un correo electrónico válido')
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const user = await User.findOne({ where: { correo: value } });
      if (user && user.id !== parseInt(id)) {
        throw new Error('Ya existe un usuario con ese correo.');
      }
    }),

  check('password')
    .optional()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .isStrongPassword().withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo.'),

  check('perfil_id').optional().isInt().withMessage('El ID de perfil debe ser un número'),
];

module.exports = {
  validatorUserCreate,
  validatorUserUpdate,
};