const express = require('express');
const router = express.Router();
const { get, getById, create, update, destroy } = require('../controllers/CategoryController');
const { validatorCategoryCreate, validatorCategoryUpdate } = require('../validators/CategoryValidator.js');
const { validateResult } = require('../helpers/validationHelper');
const { authenticateToken, isContributorOrAdmin } = require('../middlewares/jwt');

// Rutas para Categorías
router.get('/categories', get);
router.get('/categories/:id', getById);
router.post('/categories', authenticateToken, isContributorOrAdmin, validatorCategoryCreate, validateResult, create);
router.put('/categories/:id', authenticateToken, isContributorOrAdmin, validatorCategoryUpdate, validateResult, update);
router.delete('/categories/:id', authenticateToken, isContributorOrAdmin, destroy);

module.exports = router;