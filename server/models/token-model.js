const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Используем относительный путь для sequelize
const User = require('./user-model'); // Используем относительный путь для user-model

const Token = sequelize.define('Token', {
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Token.belongsTo(User); // Устанавливаем связь с моделью User

module.exports = Token;