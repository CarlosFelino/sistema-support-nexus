const userModel = require('../models/userModel');

exports.cadastrarUsuario = (req, res) => {
  const dados = req.body;

  if (!dados.employeeID || !dados.email || !dados.password || !dados.fullName) {
    return res.status(400).send('Campos obrigatórios ausentes');
  }

  userModel.inserirUsuario(dados, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar:', err);
      return res.status(500).send('Erro ao cadastrar usuário');
    }

    res.status(201).send('Usuário cadastrado com sucesso!');
  });
};
