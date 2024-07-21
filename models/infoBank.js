const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const InfoBank = sequelize.define('InfoBank', {
  id_infob: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rib: {
    type: DataTypes.STRING(50)
  },
  mtn: {
    type: DataTypes.STRING(50)
  },
  celtics: {
    type: DataTypes.STRING(50)
  },
  libercom: {
    type: DataTypes.STRING(50)
  },
  email: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'info_bank',
  timestamps: false
});

module.exports = InfoBank;