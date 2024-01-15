const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const User = require('./user-model');

const Token = sequelize.define('Token', {
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Token.belongsTo(User); // Устанавливаем связь с моделью User

module.exports = Token;