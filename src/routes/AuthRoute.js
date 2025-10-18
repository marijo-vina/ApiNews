const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/AuthController');
const { validatorRegister, validatorLogin } = require('../validators/AuthValidator');
const { validateResult } = require('../helpers/validationHelper');

// Rutas para Autenticación
router.post('/register', validatorRegister, validateResult, register);
router.post('/login', validatorLogin, validateResult, login);

module.exports = router;