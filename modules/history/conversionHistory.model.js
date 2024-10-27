// models/conversionHistory.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); // Importar a instância do Sequelize

const ConversionHistory = sequelize.define('ConversionHistory', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Certifique-se de que a tabela 'Users' existe
      key: 'id',
    },
  },
  cryptoCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false, // Assegura que o campo não seja nulo
  },
  convertedValueBRL: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  convertedValueUSD: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'conversion_histories',
  timestamps: false,
});

module.exports = ConversionHistory;
