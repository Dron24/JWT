const UserModel = require('./../models/user-model');
const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('./../dtos/user-dto');
const sequelize = require('./../db');


class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw new Error(`E-mail: "${email}" уже зарегистрирован!`);
    }
    const hashPassword = await argon2.hash(password);
    const activationLink = uuidv4();
    const user = await UserModel.create({ email, password: hashPassword, activationLink});
    await mailService.sendActivationMail(email, activationLink);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...UserDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
        ...tokens,
        user: userDto
    }
  }
}

module.exports = new UserService();