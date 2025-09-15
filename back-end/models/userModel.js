const db = require('../config/db');

exports.inserirUsuario = (dados, callback) => {
  const sql = `
    INSERT INTO users (employeeID, tipo, fullName, birthDate, email, phone, password, foto_perfil, criado_em)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const values = [
    dados.employeeID,
    dados.tipo,
    dados.fullName,
    dados.birthDate,
    dados.email,
    dados.phone,
    dados.password,
    dados.foto_perfil || null
  ];

  db.query(sql, values, callback);
};
