const express = require('express');
const router = express.Router();
const { get, getById, create, update, destroy } = require('../controllers/ProfileController');
const { validatorProfileCreate, validatorProfileUpdate } = require('../validators/ProfileValidator.js');
const { validateResult } = require('../helpers/validationHelper');
const { authenticateToken, isAdmin } = require('../middlewares/jwt');

// Rutas para Perfiles
router.get('/profiles', get);
router.get('/profiles/:id', getById);
router.post('/profiles', authenticateToken, isAdmin, validatorProfileCreate, validateResult, create);
router.put('/profiles/:id', authenticateToken, isAdmin, validatorProfileUpdate, validateResult, update);
router.delete('/profiles/:id', authenticateToken, isAdmin, destroy);

module.exports = router;