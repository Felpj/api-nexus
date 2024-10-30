// models/conversion.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./user.model'); // Certifique-se de importar o modelo User

const Conversion = sequelize.define('Conversion', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
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
  tableName: 'conversions',
  timestamps: true, // Adiciona os campos createdAt e updatedAt
  underscored: true, // Usa snake_case nos campos
});

// Definindo a relação com User
Conversion.associate = (models) => {
  Conversion.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = Conversion;
