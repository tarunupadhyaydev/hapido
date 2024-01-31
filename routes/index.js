var express = require('express');
var router = express.Router();
var app = express();
const Users = require('../controller/index')
const {validateUser,validateLogin,validateCompany,validateConnections,validateConnectionStatus,validateAddUserToCompany,
    validateUserSearch}=require("../controller/validatore")
const {upload,verifyToken}=require("../controller/helper")

app.post('/signup', validateUser, upload.single('image'), Users.signup);
app.post('/login', validateLogin, Users.login);
app.post('/add_companies', verifyToken, validateCompany, Users.add_companies);
app.post('/connections', verifyToken, validateConnections, Users.connections);
app.post('/UpdateConnectionStatus/:connectionId', verifyToken, validateConnectionStatus, Users.UpdateConnectionStatus);
app.post('/users/:userId/company', verifyToken, validateAddUserToCompany, Users.AddUserCompany);
app.get('/users/search', verifyToken, validateUserSearch, Users.UserSearch);

module.exports = app;
 