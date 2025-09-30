const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta protegida
router.get('/', authMiddleware, (req, res) => {
  res.json({
    mensaje: 'Acceso autorizado',
    usuario: req.usuario
  });
});

module.exports = router;