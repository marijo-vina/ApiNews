const { check, body } = require('express-validator');
const { Category } = require('../models/CategoryModel');
const { State } = require('../models/StateModel');
const { User } = require('../models/UserModel');

const validatorNewsCreate = [
  check('titulo')
    .notEmpty().withMessage('El título es obligatorio')
    .isString().withMessage('El título debe ser texto')
    .isLength({ min: 10, max: 255 }).withMessage('El título debe tener entre 10 y 255 caracteres'),

  check('resumen')
    .notEmpty().withMessage('El resumen es obligatorio')
    .isString().withMessage('El resumen debe ser texto')
    .isLength({ min: 10 }).withMessage('El resumen debe tener al menos 10 caracteres'),

  check('contenido')
    .notEmpty().withMessage('El contenido es obligatorio')
    .isString().withMessage('El contenido debe ser texto'),

  check('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isString().withMessage('La descripción debe ser texto'),

  check('imagen')
    .notEmpty().withMessage('La URL de la imagen es obligatoria')
    .isURL().withMessage('Debe ser una URL válida para la imagen'),

  check('fecha_publicacion')
    .notEmpty().withMessage('La fecha de publicación es obligatoria')
    .isISO8601().withMessage('La fecha de publicación debe tener un formato de fecha válido (YYYY-MM-DD)'),

  check('imagen_url')
    .optional({ checkFalsy: true })
    .isURL().withMessage('La URL de la imagen no es válida'),

  check('categoria_id')
    .notEmpty().withMessage('El ID de categoría es obligatorio')
    .isInt().withMessage('El ID de categoría debe ser un número entero')
    .custom(async (value) => {
      const category = await Category.findByPk(value);
      if (!category) throw new Error('La categoría especificada no existe.');
    }),

  check('estado_id')
    .notEmpty().withMessage('El ID de estado es obligatorio')
    .isInt().withMessage('El ID de estado debe ser un número entero')
    .custom(async (value) => {
      const state = await State.findByPk(value);
      if (!state) throw new Error('El estado especificado no existe.');
    }),

  check('usuario_id')
    .notEmpty().withMessage('El ID de usuario es obligatorio')
    .isInt().withMessage('El ID de usuario debe ser un número entero')
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) throw new Error('El usuario especificado no existe.');
    }),
];

const validatorNewsUpdate = [
  body('id').not().exists().withMessage('No se puede modificar el ID'),
  check('titulo').optional().isString().isLength({ min: 10, max: 255 }),
  check('resumen').optional().isString().isLength({ min: 10 }),
  check('contenido').optional().isString(),
  check('fecha_publicacion').optional().isISO8601(),
  check('imagen_url').optional({ checkFalsy: true }).isURL(),
  check('categoria_id').optional().isInt(),
  check('estado_id').optional().isInt(),
  // No se debería poder cambiar el autor de la noticia
  check('usuario_id').not().exists().withMessage('No se puede modificar el autor de la noticia'),
];

module.exports = {
  validatorNewsCreate,
  validatorNewsUpdate,
};