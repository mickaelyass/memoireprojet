const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Utilisateur = require('./utilisateur');

const DemandeConges = sequelize.define('DemandeConges', {
  id_cong: {
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
  date_debut: {
    type: DataTypes.DATE
  },
  date_fin: {
    type: DataTypes.DATE
  },
  raison: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'demande_conges',
  timestamps: false
});

Utilisateur.hasMany(DemandeConges, { foreignKey: 'matricule' });
DemandeConges.belongsTo(Utilisateur, { foreignKey: 'matricule' });


module.exports = DemandeConges;
