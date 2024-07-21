const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const InfoComplementaire = sequelize.define('InfoComplementaire', {
  id_infoc: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  observation_particuliere: {
    type: DataTypes.TEXT
  },
  distinction: {
    type: DataTypes.STRING(100)
  },
  ref_distinction: {
    type: DataTypes.STRING(50)
  },
  detail_distinction: {
    type: DataTypes.TEXT
  },
  situat_sante: {
    type: DataTypes.STRING(100)
  },
  saction_punitive: {
    type: DataTypes.STRING(100)
  },
  nature_sanction: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'info_complementaire',
  timestamps: false
});

module.exports = InfoComplementaire;
