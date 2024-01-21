const jwt = require('jsonwebtoken');
const { Token } = require('./../models/token-model'); // Assuming you have a Token model defined
const sequelize = require('./../db');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken
    };
  }

  async saveToken(userId, refreshToken) {
    let tokenData = await Token.findOne({ where: { UserId: userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await tokenData.save();
    } else {
      tokenData = await Token.create({ user: userId, refreshToken });
    }
    return tokenData;
  }

  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({refreshToken})
    return tokenData;
  }
}

module.exports = new TokenService();