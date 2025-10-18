const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT.
 * Si el token es válido, adjunta el payload decodificado (datos del usuario) a `req.user`.
 * Si no, devuelve un error de autenticación.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verificar que el header 'Authorization' exista y tenga el formato 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. Se requiere token en formato Bearer.' });
  }

  // 2. Extraer el token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificar el token usando el secreto del .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Adjuntar el payload del usuario al objeto request para usarlo en los siguientes middlewares o controladores
    req.user = decoded;
    next();
  } catch (err) {
    // Si el token es inválido o ha expirado, jwt.verify lanzará un error
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

/**
 * Middleware para verificar si el usuario tiene el rol de Administrador.
 * IMPORTANTE: Debe usarse siempre DESPUÉS de authenticateToken.
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.perfil_id === 1) {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de Administrador.' });
};

/**
 * Middleware para verificar si el usuario es Contribuidor o Administrador.
 * IMPORTANTE: Debe usarse siempre DESPUÉS de authenticateToken.
 */
const isContributorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.perfil_id === 1 || req.user.perfil_id === 2)) {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de Contribuidor o Administrador.' });
};

module.exports = {
  authenticateToken,
  isAdmin,
  isContributorOrAdmin,
};
