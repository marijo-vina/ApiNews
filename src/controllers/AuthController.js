const { User } = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Controlador para registrar un nuevo usuario contribuidor.
 */
const register = async (req, res) => {
  const { body } = req;
  try {
    // Hashear la contraseña antes de crear el usuario
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Crear el nuevo usuario con el perfil_id de Contribuidor (2)
    const newUser = await User.create({
      ...body,
      password: hashedPassword,
      perfil_id: 2, // Perfil de Contribuidor
    });

    // No devolvemos el password en la respuesta
    const userJson = newUser.toJSON();
    delete userJson.password;

    res.status(201).json(userJson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

/**
 * Controlador para el login de usuarios.
 */
const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // 1. Verificar si el usuario existe
    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res.status(401).json({ message: 'Sin autorización' });
    }

    // 2. Verificar si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Sin autorización' });
    }

    // 3. Si todo es correcto, crear y firmar el token JWT
    const payload = {
      id: user.id,
      nombre: user.nombre,
      perfil_id: user.perfil_id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login con éxito', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { register, login };