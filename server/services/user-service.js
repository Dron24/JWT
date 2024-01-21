const UserModel = require('./../models/user-model');
const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('./../dtos/user-dto');
const sequelize = require('./../db');
const ApiError = require('./../exceptions/api-error')

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.BadRequest(`E-mail: "${email}" уже зарегистрирован!`);
    }
    const hashPassword = await argon2.hash(password);
    const activationLink = uuidv4();
    const user = await UserModel.create({ email, password: hashPassword, activationLink});
    await mailService.sendActivationMail(email, `${process.env.APi_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
        ...tokens,
        user: userDto
    }
  }

  async activate (activationLink) {
    const user = await UserModel.findOne({activationLink})
    if(!user){
      throw ApiError.BadRequest('Некорректная ссылка активации')
    }
    user.isActivated = true;
    await user.save();
  }

  async login (email, password) {
    const user = await UserModel.findOne({email})
    if(!user){
      throw ApiError.BadRequest('Пользователь с таким email не зарегистрирован')
    }
    const isPassEquals = await argon2.verify(user.password, password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль')
    }
    const userDto = new UserDto(user);
    const token = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto }
  }

  async logout (refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
}

module.exports = new UserService();