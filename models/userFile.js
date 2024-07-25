const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Utilisateur = require('./utilisateur'); // Assurez-vous que le chemin est correct

const UserFile = sequelize.define('UserFile', {
  matricule: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'user_file',
  timestamps: false,
});

// Définir la relation : Un UserFile appartient à un Utilisateur
UserFile.belongsTo(Utilisateur, { foreignKey: 'matricule', targetKey: 'matricule' });
Utilisateur.hasOne(UserFile, { foreignKey: 'matricule', sourceKey: 'matricule' });

module.exports = UserFile;
