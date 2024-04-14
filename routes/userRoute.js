const express = require('express');
const user_route = express();

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
user_route.use(cookieParser());

const session = require('express-session');
const config = require('../config/config');
user_route.use(session({secret: config.sessionSecret, resave: true, saveUninitialized: true}));

user_route.set('view engine', 'ejs');
user_route.set('views', './views');

user_route.use(express.static('public'));

const userController = require("../controllers/userController");
const adminLoginAuth = require("../middleware/adminLoginAuth");


user_route.get('/login', adminLoginAuth.islogin , userController.loadLogin);
user_route.post('/login', userController.verifyLogin);

user_route.get('/logout',adminLoginAuth.islogin , userController.logout);

user_route.get('/profile',userController.profile);

user_route.get('/forgot-password',adminLoginAuth.islogout, userController.forgotLoad);

user_route.post('/forgot-password', userController.forgotPasswordVerify);

user_route.get('/reset-password', adminLoginAuth.islogout, userController.resetPasswordLoad);
user_route.post('/reset-password', userController.resetPassword);

module.exports = user_route;