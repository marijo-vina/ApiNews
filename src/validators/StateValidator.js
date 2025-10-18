const { check, body } = require('express-validator');
const { State } = require('../models/StateModel');

const validatorStateCreate = [
  check('nombre')
    .notEmpty().withMessage('El campo nombre es obligatorio')
    .isString().withMessage('El campo nombre debe ser texto')
    .isLength({ min: 3, max: 50 }).withMessage('El campo nombre debe tener entre 3 y 50 caracteres')
    .custom(async (value) => {
      const state = await State.findOne({ where: { nombre: value } });
      if (state) throw new Error('Ya existe un estado con ese nombre.');
    }),

  check('abreviacion')
    .notEmpty().withMessage('El campo abreviacion es obligatorio')
    .isString().withMessage('El campo abreviacion debe ser texto')
    .isLength({ min: 2, max: 10 }).withMessage('El campo abreviacion debe tener entre 2 y 10 caracteres')
    .custom(async (value) => {
      const state = await State.findOne({ where: { abreviacion: value } });
      if (state) throw new Error('Ya existe un estado con esa abreviación.');
    }),
];

const validatorStateUpdate = [
  body('id').not().exists().withMessage('No se puede modificar el ID'),
  check('nombre')
    .optional()
    .isString().withMessage('El campo nombre debe ser texto')
    .isLength({ min: 3, max: 50 }).withMessage('El campo nombre debe tener entre 3 y 50 caracteres')
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const state = await State.findOne({ where: { nombre: value } });
      if (state && state.id !== parseInt(id)) throw new Error('Ya existe un estado con ese nombre.');
    }),

  check('abreviacion')
    .optional()
    .isString().withMessage('El campo abreviacion debe ser texto')
    .isLength({ min: 2, max: 10 }).withMessage('El campo abreviacion debe tener entre 2 y 10 caracteres')
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const state = await State.findOne({ where: { abreviacion: value } });
      if (state && state.id !== parseInt(id)) throw new Error('Ya existe un estado con esa abreviación.');
    }),
];

module.exports = {
  validatorStateCreate,
  validatorStateUpdate,
};