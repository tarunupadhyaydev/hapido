const { DataTypes } = require('sequelize');
const sequelize = require('../config/config')

const User = sequelize.define('Users', {
    user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  firstName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  user_type: {
    type: DataTypes.ENUM('C', 'E'),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Users',
  timestamps: false,
});

module.exports = User 
