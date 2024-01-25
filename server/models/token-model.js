// Импортируем DataTypes из библиотеки 'sequelize'. DataTypes содержит различные типы данных, которые можно использовать в моделях Sequelize.
const { DataTypes } = require('sequelize');

// Импортируем экземпляр sequelize из файла '../db'. Этот экземпляр используется для подключения к базе данных и определения моделей.
const sequelize = require('../db');

// Импортируем модель User из файла 'user-model'. Мы будем использовать эту модель для установки связи с моделью Token.
const User = require('./user-model');

// Определяем модель 'Token' с помощью метода 'define' экземпляра sequelize. Модель имеет одно поле 'refreshToken', которое является строкой и не может быть null.
const Token = sequelize.define('Token', {
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Устанавливаем связь "один к одному" между моделями Token и User. Это значит, что каждый токен принадлежит одному пользователю.
Token.belongsTo(User);

// Экспортируем модель Token, чтобы она могла быть использована в других файлах.
module.exports = Token;
