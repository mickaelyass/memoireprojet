const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Utilisateur = require('./utilisateur');

const InfoIdent = sequelize.define('InfoIdent', {
  id_infoi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cnss: {
    type: DataTypes.STRING(50)
  },
  nom: {
    type: DataTypes.STRING(50)
  },
  prenom: {
    type: DataTypes.STRING(50)
  },
  nom_du_conjoint: {
    type: DataTypes.STRING(50)
  },
  sexe: {
    type: DataTypes.STRING(10)
  },
  dat_nat: {
    type: DataTypes.DATE
  },
  lieu_nat: {
    type: DataTypes.STRING(100)
  },
  situat_matri: {
    type: DataTypes.STRING(50)
  },
  dat_mariage: {
    type: DataTypes.DATE
  },
  nbre_enfants: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'info_ident',
  timestamps: false
});

module.exports = InfoIdent;