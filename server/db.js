const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных установлено');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
};

checkDatabaseConnection();

module.exports = sequelize;