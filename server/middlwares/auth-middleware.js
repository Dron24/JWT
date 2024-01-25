// Импорт класса ApiError, который будет использован для создания и возвращения ошибок API
const ApiError = require('./../exceptions/api-error');
// Импорт сервиса tokenService, который будет использован для проверки валидности токена доступа
const tokenService = require('./../services/token-service');

// Экспорт функции middleware, которая будет использована в Express.js
module.exports = function(req, res, next) {
    try {
        // Извлечение заголовка авторизации из входящего запроса
        const authorizationHeader = req.headers.authorization;
        // Если заголовок авторизации отсутствует, вызовется следующий middleware с ошибкой UnauthorizedError
        if (!authorizationHeader){
            return next(ApiError.UnauthorizedError());
        }

        // Извлечение токена доступа из заголовка авторизации (предполагается, что формат заголовка - "Bearer {token}")
        const accessToken = authorizationHeader.split(' ')[1];
        // Если токен доступа отсутствует, вызовется следующий middleware с ошибкой UnauthorizedError
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        // Проверка валидности токена доступа с помощью tokenService
        const userData = tokenService.validateAccessToken(accessToken);
        // Если токен доступа недействителен (или его нет), вызовется следующий middleware с ошибкой UnauthorizedError
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }
        // Если токен действителен, данные пользователя из токена сохраняются в объект запроса
        req.user = userData;
        // Вызов следующего middleware в стеке
        next();
    } catch (e) {
        // Если в процессе произошла ошибка, вызовется следующий middleware с ошибкой UnauthorizedError
        return next(ApiError.UnauthorizedError());
    }
}
