// Импорт класса ApiError из другого файла
const ApiError = require('./../exceptions/api-error')

// Экспорт функции-обработчика ошибок
module.exports = function(err, req, res, next) {
    // Вывод информации об ошибке в консоль
    console.log(err);
    // Проверка, является ли ошибка экземпляром ApiError
    if (err instanceof ApiError) {
        // Если ошибка является экземпляром ApiError, то устанавливаем HTTP статус ошибки и отправляем JSON с сообщением об ошибке и дополнительной информацией об ошибках
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    // Если ошибка не является экземпляром ApiError, то устанавливаем HTTP статус 500 (Внутренняя ошибка сервера) и отправляем JSON с сообщением 'Непредвиденная ошибка'
    return res.status(500).json({message: 'Непредвиденная ошибка'})
}
