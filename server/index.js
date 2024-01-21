require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./db');
const router = require('./router/index');
const errorMiddleware = require('./middlwares/error-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware)

// Добавьте здесь вашу логику приложения

// Запуск сервера
const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Сервер успешно запущен! Порт: ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();