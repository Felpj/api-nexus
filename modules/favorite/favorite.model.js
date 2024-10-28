// favorite/favorite.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); // Ajuste o caminho conforme sua estrutura

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: { // Relaciona com o usuário
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Nome da tabela de usuários
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  cryptoSymbol: { // Símbolo da criptomoeda (e.g., BTC, ETH)
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'favorites', // Nome da tabela no banco de dados
  timestamps: true, // Adiciona campos createdAt e updatedAt
  indexes: [
    {
      unique: true,
      fields: ['userId', 'cryptoSymbol'], // Garante que um usuário não possa favoritar a mesma criptomoeda mais de uma vez
    },
  ],
});

module.exports = Favorite;
