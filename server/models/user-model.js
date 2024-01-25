// Импорт объекта DataTypes из библиотеки Sequelize. 
// DataTypes содержит функции, которые определяют типы данных колонок в базе данных
const { DataTypes } = require('sequelize');
// Импорт экземпляра sequelize, который используется для взаимодействия с базой данных
const sequelize = require('./../db');

// Определение модели User. Модель представляет таблицу в базе данных
const User = sequelize.define('User', {
  // Определение колонки email. Она должна быть строкой, не может быть пустой и должна быть уникальной
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Определение колонки password. Она должна быть строкой и не может быть пустой
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Определение колонки isActivated. Это булево значение, по умолчанию false
  isActivated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Определение колонки activationLink. Это строка, которая может быть пустой
  activationLink: {
    type: DataTypes.STRING,
  },
});

// Экспорт модели User, чтобы она могла быть использована в других файлах
module.exports = User;
