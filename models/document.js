const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Dossier=require('./dossier'); // Assurez-vous que le chemin est correct

const Document = sequelize.define('Document', {
  matricule: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.TEXT,
  }
  ,
  file_name: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'document',
  timestamps: false,
});

// Définir la relation : Un Document appartient à un Utilisateur
Document.belongsTo(Dossier, { foreignKey: 'matricule', targetKey: 'matricule' });
Dossier.hasMany(Document, { foreignKey: 'matricule', sourceKey: 'matricule' });

module.exports = Document;
