// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,       // Nome do banco de dados
  process.env.DB_USER,       // Usuário
  process.env.DB_PASS || '',       // Senha
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
    define: {
      timestamps: true,      // Cria automaticamente os campos createdAt e updatedAt
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,          // Desabilita logs SQL no console
  }
);

module.exports = sequelize;
