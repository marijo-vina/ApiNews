const express = require('express');
const router = express.Router();
const { get, getById, create, update, destroy } = require('../controllers/UserController');
const { validatorUserCreate, validatorUserUpdate } = require('../validators/UserValidator.js');
const { validateResult } = require('../helpers/validationHelper');
const { authenticateToken, isAdmin } = require('../middlewares/jwt');

// Rutas para Usuarios
router.get('/users', get);
router.get('/users/:id', getById);
router.post('/users', authenticateToken, isAdmin, validatorUserCreate, validateResult, create);
router.put('/users/:id', authenticateToken, isAdmin, validatorUserUpdate, validateResult, update);
router.delete('/users/:id', authenticateToken, isAdmin, destroy);

module.exports = router;