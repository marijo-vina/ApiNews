const { check, body } = require('express-validator');
const { Category } = require('../models/CategoryModel');

const validatorCategoryCreate = [
  check('nombre')
    .notEmpty().withMessage('El campo nombre es obligatorio')
    .isString().withMessage('El campo nombre debe ser texto')
    .isLength({ min: 3, max: 50 }).withMessage('El campo nombre debe tener entre 3 y 50 caracteres')
    .custom(async (value) => {
      const category = await Category.findOne({ where: { nombre: value } });
      if (category) {
        throw new Error('Ya existe una categoría con ese nombre');
      }
    }),

  check('descripcion')
    .optional()
    .isString().withMessage('El campo descripcion debe ser texto')
    .isLength({ min: 5, max: 255 }).withMessage('El campo descripción debe tener entre 5 y 255 caracteres'),

  check('activo')
    .optional()
    .isBoolean().withMessage('El campo activo debe ser un valor booleano'),
];

const validatorCategoryUpdate = [
  body('id').not().exists().withMessage('No se puede modificar el ID'),
  check('nombre')
    .optional()
    .isString().withMessage('El campo nombre debe ser texto')
    .isLength({ min: 3, max: 50 }).withMessage('El campo nombre debe tener entre 3 y 50 caracteres')
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const category = await Category.findOne({ where: { nombre: value } });
      if (category && category.id !== parseInt(id)) {
        throw new Error('Ya existe una categoría con ese nombre');
      }
    }),

  check('descripcion')
    .optional()
    .isString().withMessage('El campo descripcion debe ser texto')
    .isLength({ min: 5, max: 255 }).withMessage('El campo descripción debe tener entre 5 y 255 caracteres'),

  check('activo')
    .optional()
    .isBoolean().withMessage('El campo activo debe ser un valor booleano'),
];

module.exports = {
  validatorCategoryCreate,
  validatorCategoryUpdate,
};