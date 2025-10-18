const { validationResult } = require('express-validator');

/**
 * Middleware para validar los resultados de express-validator.
 * Si hay errores de validación, responde con un estado 400 y los errores.
 * Si no hay errores, pasa al siguiente middleware (el controlador).
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar al siguiente middleware.
 */
const validateResult = (req, res, next) => {
    try {
        // validationResult(req) extrae los errores de validación de la solicitud.
        // .throw() lanza una excepción si encuentra algún error.
        validationResult(req).throw();
        // Si no hay errores, llama a next() para continuar con el controlador de la ruta.
        return next();
    } catch (err) {
        // Si se lanza una excepción, significa que hubo errores de validación.
        // Respondemos con un estado 400 y un JSON que contiene el array de errores.
        res.status(400).json({ errors: err.array() });
    }
};

module.exports = { validateResult };