// Импорт модуля 'nodemailer', который предоставляет функциональность для отправки электронных писем
const nodemailer = require('nodemailer');

// Определение класса MailService
class MailService {
  // Конструктор класса, который вызывается при создании нового экземпляра класса
  constructor() {
    // Создание транспорта для отправки электронных писем с использованием nodemailer. 
    // Конфигурация транспорта задается через переменные окружения
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // адрес SMTP сервера
      port: process.env.SMTP_PORT, // порт SMTP сервера
      secure: false, // опция secure указывает, следует ли использовать защищенное соединение
      auth: {
        user: process.env.SMTP_USER, // имя пользователя для SMTP сервера
        pass: process.env.SMTP_PASSWORD // пароль пользователя для SMTP сервера
      }
    });
  }

  // Метод для отправки письма с ссылкой на активацию аккаунта
  async sendActivationMail(to, link) {
    // Отправка письма с использованием созданного транспорта
    await this.transporter.sendMail({
      from: process.env.SMTP_USER, // адрес отправителя
      to, // адрес получателя
      subject: 'Активация аккаунта на ' + process.env.APi_URL, // тема письма
      text: '', // текстовое тело письма
      html: `
        <div>
          <h1>Активация аккаунта</h1>
          <a href="${link}">${link}</a>
        </div>
      ` // HTML тело письма
    });
  }
}

// Экспорт экземпляра класса MailService. Это позволяет использовать один и тот же экземпляр класса во всем приложении
module.exports = new MailService();
