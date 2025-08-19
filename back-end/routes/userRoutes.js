const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota de cadastro de usuário
router.post('/cadastro', userController.cadastrarUsuario);

module.exports = router;
