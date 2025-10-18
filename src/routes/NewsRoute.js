const express = require('express');
const router = express.Router();
const { get, getById, create, update, destroy } = require('../controllers/NewsController');
const { validatorNewsCreate, validatorNewsUpdate } = require('../validators/NewsValidator.js');
const { validateResult } = require('../helpers/validationHelper');
const { authenticateToken, isContributorOrAdmin } = require('../middlewares/jwt');

// Rutas para Noticias
router.get('/news', get);
router.get('/news/:id', getById);
router.post('/news', authenticateToken, isContributorOrAdmin, validatorNewsCreate, validateResult, create);
router.put('/news/:id', authenticateToken, isContributorOrAdmin, validatorNewsUpdate, validateResult, update);
router.delete('/news/:id', authenticateToken, isContributorOrAdmin, destroy);

module.exports = router;