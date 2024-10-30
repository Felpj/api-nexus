// models/conversion.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Conversion = sequelize.define('Conversion', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cryptoCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  convertedValueBRL: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  convertedValueUSD: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  conversionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'conversions', // Certifique-se de que este é o nome correto da tabela
  timestamps: false,
});

module.exports = Conversion;
