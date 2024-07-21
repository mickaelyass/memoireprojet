const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Utilisateur = require('./utilisateur'); // Assurez-vous que le chemin est correct

const UserProfile = sequelize.define('UserProfile', {
  matricule: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  profile_image_url: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'user_profiles',
  timestamps: false,
});

// Définir la relation : Un UserProfile appartient à un Utilisateur
UserProfile.belongsTo(Utilisateur, { foreignKey: 'matricule', targetKey: 'matricule' });
Utilisateur.hasOne(UserProfile, { foreignKey: 'matricule', sourceKey: 'matricule' });

module.exports = UserProfile;
