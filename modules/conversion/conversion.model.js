// modules/conversion/conversion.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Definição do modelo Conversion
const Conversion = sequelize.define('Conversion', {
  // Chave estrangeira para o usuário
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',  // Tabela associada
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  // Nome da criptomoeda
  cryptoCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Quantidade da criptomoeda
  amount: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  // Valor convertido para BRL
  convertedValueBRL: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  // Valor convertido para USD
  convertedValueUSD: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
  },
  // Data da conversão
  conversionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  tableName: 'Conversions',
});

module.exports = Conversion;
