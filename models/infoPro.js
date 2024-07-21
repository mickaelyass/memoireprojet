const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const InfoPro = sequelize.define('InfoPro', {
  id_infop: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  statut: {
    type: DataTypes.STRING(50)
  },
  corps: {
    type: DataTypes.STRING(50)
  },
  categorie: {
    type: DataTypes.STRING(50)
  },
  branche_du_personnel: {
    type: DataTypes.STRING(50)
  },
  fonctions: {
    type: DataTypes.STRING(100)
  },
  ref_nomination: {
    type: DataTypes.STRING(50)
  },
  dat_prise_fonction: {
    type: DataTypes.DATE
  },
  responsabilite_partiuliere: {
    type: DataTypes.STRING(100)
  },
  grade_paye: {
    type: DataTypes.STRING(50)
  },
  indice_paye: {
    type: DataTypes.INTEGER
  },
  dat_first_prise_de_service: {
    type: DataTypes.DATE
  },
  dat_de_depart_retraite: {
    type: DataTypes.DATE
  },
  dat_de_prise_service_dans_departement: {
    type: DataTypes.DATE
  },
  ref_acte_de_prise_service_poste_actuel: {
    type: DataTypes.STRING(100)
  },
  poste_actuel_service: {
    type: DataTypes.STRING(100)
  },
  type_structure: {
    type: DataTypes.STRING(50)
  },
  zone_sanitaire: {
    type: DataTypes.STRING(50)
  },
  poste_specifique: {
    type: DataTypes.STRING(100)
  },
  etat_depart: {
    type: DataTypes.STRING(50)
  },
  poste_anterieurs: {
    type: DataTypes.STRING(100)
  },
  autres_diplome: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'info_pro',
  timestamps: false
});

module.exports = InfoPro;
