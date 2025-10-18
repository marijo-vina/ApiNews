const express = require('express');
const router = express.Router();
const { get, getById, create, update, destroy } = require('../controllers/StateController');
const { validatorStateCreate, validatorStateUpdate } = require('../validators/StateValidator.js');
const { validateResult } = require('../helpers/validationHelper');
const { authenticateToken, isAdmin } = require('../middlewares/jwt');

// Rutas para Estados
router.get('/states', get);
router.get('/states/:id', getById);
router.post('/states', authenticateToken, isAdmin, validatorStateCreate, validateResult, create);
router.put('/states/:id', authenticateToken, isAdmin, validatorStateUpdate, validateResult, update);
router.delete('/states/:id', authenticateToken, isAdmin, destroy);

module.exports = router;