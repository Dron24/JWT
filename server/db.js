// Импорт модуля Sequelize из библиотеки sequelize
const { Sequelize } = require('sequelize');

// Создание нового экземпляра Sequelize для подключения к базе данных
// Параметры подключения (имя базы данных, имя пользователя, пароль и хост) берутся из переменных окружения
const sequelize = new Sequelize(
  process.env.DB_NAME,  // имя базы данных
  process.env.DB_USER,  // имя пользователя
  process.env.DB_PASSWORD,  // пароль
  {
    host: process.env.DB_HOST,  // хост, на котором расположена база данных
    dialect: 'mysql',  // диалект SQL, используемый для взаимодействия с базой данных (в данном случае MySQL)
  }
);

// Функция для проверки подключения к базе данных
const checkDatabaseConnection = async () => {
  try {
    // Попытка аутентификации (подключения) к базе данных
    await sequelize.authenticate();
    // Если подключение успешно, вывод сообщения об этом
    console.log('Подключение к базе данных установлено');
  } catch (error) {
    // Если при подключении произошла ошибка, вывод ошибки
    console.error('Ошибка подключения к базе данных:', error);
  }
};

// Вызов функции для проверки подключения к базе данных
checkDatabaseConnection();

// Экспорт экземпляра Sequelize, чтобы он мог быть использован в других частях приложения
module.exports = sequelize;
