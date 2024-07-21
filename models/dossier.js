const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Utilisateur = require('./utilisateur');
const InfoIdent = require('./infoIdent');
const InfoPro = require('./infoPro');
const InfoBank = require('./infoBank');
const InfoComplementaire = require('../models/infoComplementaire');

const Dossier = sequelize.define('Dossier', {
  id_dossier: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matricule: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: Utilisateur,
      key: 'matricule'
    }
  },
  id_infoi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: InfoIdent,
      key: 'id_infoi'
    }
  },
  id_infop: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: InfoPro,
      key: 'id_infop'
    }
  },
  id_infob: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: InfoBank,
      key: 'id_infob'
    }
  },
  id_infoc: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: InfoComplementaire,
      key: 'id_infoc'
    }
  }
}, {
  tableName: 'dossier',
  timestamps: false
});



// Définition des relations entre Dossier et les autres modèles
Dossier.belongsTo(InfoIdent, { foreignKey: 'id_infoi', targetKey: 'id_infoi' });
Dossier.belongsTo(InfoPro, { foreignKey: 'id_infop', targetKey: 'id_infop' });
Dossier.belongsTo(InfoBank, { foreignKey: 'id_infob', targetKey: 'id_infob' });
Dossier.belongsTo(InfoComplementaire, { foreignKey: 'id_infoc', targetKey: 'id_infoc' });


Utilisateur.hasMany(Dossier, { foreignKey: 'matricule', sourceKey: 'matricule' });
Dossier.belongsTo(Utilisateur, { foreignKey: 'matricule', targetKey: 'matricule' });

//Utilisateur.hasMany(InfoIdent, { foreignKey: 'matricule', sourceKey: 'matricule' });
//InfoIdent.belongsTo(Utilisateur, { foreignKey: 'matricule', targetKey: 'matricule' });

module.exports = Dossier;