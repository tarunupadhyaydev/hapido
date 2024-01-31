const { DataTypes } = require('sequelize');
const sequelize = require('../config/config')

const connections = sequelize.define('connections', {

  connection_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  sender_company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  receiver_company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'connections', 
  timestamps: false,
});

module.exports = connections;
