// Импорт модуля dotenv, который позволяет загружать переменные окружения из файла .env
require('dotenv').config();

// Импорт библиотеки express, которая используется для создания веб-приложений на Node.js
const express = require('express');

// Импорт библиотеки cors, которая используется для обработки CORS (Cross-Origin Resource Sharing)
const cors = require('cors');

// Импорт библиотеки cookie-parser, которая используется для парсинга cookie-заголовков
const cookieParser = require('cookie-parser');

// Импорт модуля sequelize, который используется для взаимодействия с базой данных
const sequelize = require('./db');

// Импорт модуля router, который содержит все маршруты приложения
const router = require('./router/index');

// Импорт модуля errorMiddleware, который обрабатывает ошибки в приложении
const errorMiddleware = require('./middlwares/error-middleware');

// Создание нового экземпляра express-приложения
const app = express();

// Определение порта, на котором будет запущено приложение. Значение берется из переменных окружения или устанавливается по умолчанию в 5000
const PORT = process.env.PORT || 5000;

// Middleware

// Использование middleware для парсинга JSON-данных в запросах
app.use(express.json());

// Использование middleware для парсинга cookie-заголовков
app.use(cookieParser());

// Использование middleware для обработки маршрутов, начинающихся с /api
app.use('/api', router);

// Использование middleware для обработки CORS. Параметры конфигурации указывают, что cookie-файлы должны быть включены, и указывают источник запросов
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

// Использование middleware для обработки ошибок
app.use(errorMiddleware)

// Добавьте здесь вашу логику приложения

// Запуск сервера
const start = async () => {
  try {
    // Запуск прослушивания порта для входящих подключений. При успешном запуске выводится сообщение в консоль
    app.listen(PORT, () => console.log(`Сервер успешно запущен! Порт: ${PORT}`));
  } catch (e) {
    // Если при запуске сервера произошла ошибка, выводится сообщение об ошибке
    console.log(e);
  }
};

// Вызов функции start для запуска сервера
start();
