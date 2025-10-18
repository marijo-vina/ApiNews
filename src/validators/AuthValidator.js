const { check } = require('express-validator');
const { User } = require('../models/UserModel');

const validatorRegister = [
  check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser texto'),

  check('apellidos')
    .notEmpty().withMessage('Los apellidos son obligatorios')
    .isString().withMessage('Los apellidos deben ser texto'),

  check('nick')
    .notEmpty().withMessage('El nick es obligatorio')
    .isString().withMessage('El nick debe ser texto'),

  check('correo')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo electrónico válido')
    .custom(async (value) => {
      // Verifica que el correo no esté ya registrado
      const user = await User.findOne({ where: { correo: value } });
      if (user) {
        throw new Error('Ya existe un usuario con ese correo.');
      }
    }),

  check('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .isStrongPassword().withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo.'),
];

const validatorLogin = [
  check('correo').notEmpty().withMessage('El correo es obligatorio').isEmail(),
  check('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

module.exports = {
  validatorRegister,
  validatorLogin,
};
