const { DataTypes } = require('sequelize');
const sequelize = require('../config/config')

const Users_companies = sequelize.define('Users_companies', {

  company_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  size: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  industry: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Users_companies',
  timestamps: false,
});

module.exports = Users_companies;
