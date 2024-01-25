// Импортируем модель пользователя
const UserModel = require('./../models/user-model');
// Импортируем библиотеку argon2 для хеширования паролей
const argon2 = require('argon2');
// Импортируем функцию uuidv4 для создания уникальных идентификаторов
const { v4: uuidv4 } = require('uuid');
// Импортируем сервис для отправки электронной почты
const mailService = require('./mail-service');
// Импортируем сервис для работы с токенами
const tokenService = require('./token-service');
// Импортируем класс UserDto, который представляет собой объект передачи данных пользователя
const UserDto = require('./../dtos/user-dto');
// Импортируем объект sequelize для работы с базой данных
const sequelize = require('./../db');
// Импортируем класс ApiError для создания ошибок API
const ApiError = require('./../exceptions/api-error')

// Создаем класс UserService
class UserService {
  // Метод для регистрации пользователя
  async register(email, password) {
    // Проверяем, существует ли уже пользователь с таким адресом электронной почты
    const candidate = await UserModel.findOne({ where: { email } });
    if (candidate) {
      // Если пользователь существует, выбрасываем ошибку
      throw ApiError.BadRequest(`E-mail: "${email}" уже зарегистрирован!`);
    }
    // Хешируем пароль пользователя
    const hashPassword = await argon2.hash(password);
    // Создаем уникальную ссылку активации
    const activationLink = uuidv4();
    // Создаем нового пользователя в базе данных
    const user = await UserModel.create({ email, password: hashPassword, activationLink});
    // Отправляем письмо с ссылкой активации на адрес электронной почты пользователя
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    // Создаем объект передачи данных пользователя
    const userDto = new UserDto(user);
    // Генерируем токены для пользователя
    const tokens = tokenService.generateTokens({...userDto});
    // Сохраняем токен обновления в базе данных
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    // Возвращаем токены и данные пользователя
    return {
        ...tokens,
        user: userDto
    }
  }

  // Метод для активации пользователя
  async activate (activationLink) {
    // Находим пользователя по ссылке активации
    const user = await UserModel.findOne({activationLink})
    if(!user){
      // Если пользователь не найден, выбрасываем ошибку
      throw ApiError.BadRequest('Некорректная ссылка активации')
    }
    // Устанавливаем флаг активации пользователя в true
    user.isActivated = true;
    // Сохраняем изменения пользователя
    await user.save();
  }

  // Метод для входа пользователя в систему
  async login (email, password) {
    // Находим пользователя по адресу электронной почты
    const user = await UserModel.findOne({email})
    if(!user){
      // Если пользователь не найден, выбрасываем ошибку
      throw ApiError.BadRequest('Пользователь с таким email не зарегистрирован')
    }
    // Проверяем, совпадает ли введенный пароль с хешированным паролем пользователя
    const isPassEquals = await argon2.verify(user.password, password);
    if (!isPassEquals) {
      // Если пароли не совпадают, выбрасываем ошибку
      throw ApiError.BadRequest('Неверный пароль')
    }
    // Создаем объект передачи данных пользователя
    const userDto = new UserDto(user);
    // Генерируем токены для пользователя
    const tokens = tokenService.generateTokens({...userDto});

    // Сохраняем токен обновления в базе данных
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    // Возвращаем токены и данные пользователя
    return { ...tokens, user: userDto }
  }

  // Метод для выхода пользователя из системы
  async logout (refreshToken) {
    // Удаляем токен обновления из базы данных
    const token = await tokenService.removeToken(refreshToken);
    // Возвращаем удаленный токен
    return token;
  }

  // Метод для обновления токенов пользователя
  async refresh (refreshToken) {
    // Если токен обновления не предоставлен, выбрасываем ошибку
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    // Проверяем, действителен ли токен обновления
    const userData = tokenService.validateRefreshToken(refreshToken);
    // Находим токен обновления в базе данных
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      // Если токен обновления недействителен или не найден в базе данных, выбрасываем ошибку
      throw ApiError.UnauthorizedError();
    }
    // Находим пользователя по id
    const user = await UserModel.findById(userData.id);
    // Создаем объект передачи данных пользователя
    const userDto = new UserDto(user);
    // Генерируем новые токены для пользователя
    const tokens = tokenService.generateTokens({...userDto});
    
    // Сохраняем новый токен обновления в базе данных
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    // Возвращаем новые токены и данные пользователя
    return { ...tokens, user: userDto }
  }

  // Метод для получения всех пользователей
  async getAllUsers() {
    // Находим всех пользователей в базе данных
    const users = await UserModel.findAll();
    // Возвращаем найденных пользователей
    return users;
  }
}

// Экспортируем экземпляр класса UserService
module.exports = new UserService();
