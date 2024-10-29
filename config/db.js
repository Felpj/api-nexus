// config/db.js
const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');
require('dotenv').config();

// Adicione os console.log() aqui para verificar as variáveis de ambiente
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

const sequelize = new Sequelize(
  process.env.DB_NAME,       
  process.env.DB_USER,       
  process.env.DB_PASS || '',       
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    dialectModule: mysql2,
    port: process.env.DB_PORT || 3306,
    define: {
      timestamps: true,      
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,         
  }
);

module.exports = sequelize;
