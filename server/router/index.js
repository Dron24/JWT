const Router = require('express').Router;
const userController = require('./../controllers/user-controller');
const router = new Router();
const sequelize = require('./../db');
const {body} = require('express-validator');
const authMiddleware = require('./../middlwares/auth-middleware');


router.post('/register', 
body('email').isEmail(),
body('password').isLength({min:6, max:32}),
userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

module.exports = router;