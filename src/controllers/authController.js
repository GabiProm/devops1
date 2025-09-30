const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { esquemaRegistro, esquemaLogin } = require('../utils/validaciones');

// Función para generar el token JWT
const generarToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

// Registro de usuario
exports.register = async (req, res) => {
  try {
    // Validar datos con Joi
    const { error } = esquemaRegistro.validate(req.body);
    if (error) {
      return res.status(400).json({ mensaje: error.details[0].message });
    }

    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new User({ name, email, password });
    await nuevoUsuario.save();

    // Generar token
    const token = generarToken(nuevoUsuario._id);

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: nuevoUsuario._id,
        name: nuevoUsuario.name,
        email: nuevoUsuario.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el registro', error: error.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    // Validar datos con Joi
    const { error } = esquemaLogin.validate(req.body);
    if (error) {
      return res.status(400).json({ mensaje: error.details[0].message });
    }

    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // Comparar contraseñas
    const esValido = await usuario.comparePassword(password);
    if (!esValido) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generarToken(usuario._id);

    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el login', error: error.message });
  }
};
