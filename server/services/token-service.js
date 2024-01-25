// Импорт библиотеки jsonwebtoken, которая предоставляет функции для работы с JWT
const jwt = require('jsonwebtoken');
// Импорт модели Token, которая представляет собой таблицу в базе данных для хранения токенов
const { Token } = require('./../models/token-model');
// Импорт объекта sequelize, который предоставляет функции для работы с базой данных
const sequelize = require('./../db');

// Определение класса TokenService
class TokenService {
  // Метод для генерации пары access и refresh токенов
  generateTokens(payload) {
    // Создание access токена, который истекает через 30 минут
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    // Создание refresh токена, который истекает через 30 дней
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    // Возвращение объекта с созданными токенами
    return {
      accessToken,
      refreshToken
    };
  }

  // Метод для валидации access токена
  validateAccessToken(token) {
    try {
      // Попытка верификации токена и возвращение данных пользователя, если токен действителен
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      // Возвращение null, если токен недействителен
      return null;
    }
  }
  
  // Метод для валидации refresh токена
  validateRefreshToken(token) {
    try {
      // Попытка верификации токена и возвращение данных пользователя, если токен действителен
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      // Возвращение null, если токен недействителен
      return null;
    }
  }

  // Метод для сохранения refresh токена в базе данных
  async saveToken(userId, refreshToken) {
    // Поиск токена в базе данных по id пользователя
    let tokenData = await Token.findOne({ where: { UserId: userId } });
    if (tokenData) {
      // Если токен найден, обновление его значения
      tokenData.refreshToken = refreshToken;
      await tokenData.save();
    } else {
      // Если токен не найден, создание нового токена
      tokenData = await Token.create({ user: userId, refreshToken });
    }
    // Возвращение данных токена
    return tokenData;
  }

  // Метод для удаления токена из базы данных
  async removeToken(refreshToken) {
    // Удаление токена из базы данных
    const tokenData = await Token.deleteOne({refreshToken})
    // Возвращение данных удаленного токена
    return tokenData;
  }

  // Метод для поиска токена в базы данных
  async findToken(refreshToken) {
    // Поиск токена в базе данных
    const tokenData = await Token.findOne({refreshToken})
    // Возвращение данных найденного токена
    return tokenData;
  }
  
}

// Экспорт экземпляра класса TokenService
module.exports = new TokenService();
Token