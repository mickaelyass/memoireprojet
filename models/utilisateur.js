const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Utilisateur = sequelize.define('Utilisateur', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matricule: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'utilisateur',
  timestamps: false
});

module.exports = Utilisateur;