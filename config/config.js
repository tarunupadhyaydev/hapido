require('dotenv').config();

const { Sequelize } = require('sequelize');

const customLogger = () => {
  console.log('Connected to the database');
};

const sequelize = new Sequelize({
  database: process.env.database,
    username: process.env.user,
    password: process.env.password,
    host: process.env.host,
    dialect: 'mysql',
    logging: customLogger,

});

module.exports = sequelize;
