const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur'); // Assurez-vous que le chemin est correct
const { hashPassword, comparePassword, generateToken } = require('../utils/auth'); // Importez vos fonctions utilitaires
const Dossier = require('../models/dossier');
const InfoIdent = require('../models/infoIdent');
const InfoPro = require('../models/infoPro');
const InfoBank = require('../models/infoBank');
const InfoComplementaire = require('../models/infoComplementaire');
const { Op } = require('sequelize');
const { getIo } = require('../utils/socket');
const Notification = require('../models/notification');
// Lire tous les dossiers
router.get('/notifications',async (req, res) => {
  try {
    const notification = await Notification.findAll(
      {
        order: [['create_dat', 'DESC']],
        limit: 9
      }
    );
    res.json(notification);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/dossiers', async (req, res) => {
    try {
      const dossiers = await Dossier.findAll({
        include: [
          {
            model: Utilisateur,
            attributes: ['matricule','role']
          },
          {
            model: InfoIdent,
            attributes: [
              'cnss', 'nom', 'prenom', 'nom_du_conjoint', 'sexe', 'dat_nat', 'lieu_nat', 
              'situat_matri', 'dat_mariage', 'nbre_enfants'
            ]
          },
          {
            model: InfoPro,
            attributes: [
              'statut', 'corps', 'categorie', 'branche_du_personnel', 'fonctions', 'ref_nomination',
              'dat_prise_fonction', 'responsabilite_partiuliere', 'grade_paye', 'indice_paye', 
              'dat_first_prise_de_service', 'dat_de_depart_retraite', 'dat_de_prise_service_dans_departement',
              'ref_acte_de_prise_service_poste_actuel', 'poste_actuel_service', 'type_structure', 
              'zone_sanitaire', 'poste_specifique', 'etat_depart', 'poste_anterieurs', 'autres_diplome'
            ]
          },
          {
            model: InfoBank,
            attributes: [
              'rib', 'mtn', 'celtics', 'libercom', 'email'
            ]
          },
          {
            model: InfoComplementaire,
            attributes: [
              'observation_particuliere', 'distinction', 'ref_distinction', 'detail_distinction',
              'situat_sante', 'saction_punitive', 'nature_sanction'
            ]
          }
        ]
      });
      
      res.json(dossiers);
    } catch (err) {
      console.error('Error fetching dossiers', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/dossiers/search', async (req, res) => {
    const { nom, service } = req.query;
  
    const whereClause = {};
  
    if (nom) {
        whereClause['$InfoIdent.nom$'] = {
            [Op.iLike]: `%${nom}%`
        };
    }
  
    if (service) {
        whereClause['$InfoPro.poste_actuel_service$'] = {
            [Op.iLike]: `%${service}%`
        };
    }
  
    console.log('Received query parameters:', req.query);
    console.log('Constructed whereClause:', whereClause);
  
    try {
        const dossiers = await Dossier.findAll({
            include: [
                {
                    model: Utilisateur,
                    attributes: ['matricule', 'role']
                },
                {
                    model: InfoIdent,
                    attributes: [
                        'cnss', 'nom', 'prenom', 'nom_du_conjoint', 'sexe', 'dat_nat', 'lieu_nat', 
                        'situat_matri', 'dat_mariage', 'nbre_enfants'
                    ]
                },
                {
                    model: InfoPro,
                    attributes: [
                        'statut', 'corps', 'categorie', 'branche_du_personnel', 'fonctions', 'ref_nomination',
                        'dat_prise_fonction', 'responsabilite_partiuliere', 'grade_paye', 'indice_paye', 
                        'dat_first_prise_de_service', 'dat_de_depart_retraite', 'dat_de_prise_service_dans_departement',
                        'ref_acte_de_prise_service_poste_actuel', 'poste_actuel_service', 'type_structure', 
                        'zone_sanitaire', 'poste_specifique', 'etat_depart', 'poste_anterieurs', 'autres_diplome'
                    ]
                },
                {
                    model: InfoBank,
                    attributes: [
                        'rib', 'mtn', 'celtics', 'libercom', 'email'
                    ]
                },
                {
                    model: InfoComplementaire,
                    attributes: [
                        'observation_particuliere', 'distinction', 'ref_distinction', 'detail_distinction',
                        'situat_sante', 'saction_punitive', 'nature_sanction'
                    ]
                }
            ],
            where: whereClause
        });
  
        console.log('Dossiers found:', dossiers);
        res.json(dossiers);
    } catch (err) {
        console.error('Error fetching dossiers', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  });
  
  // Lire un dossier par ID
  router.get('/dossiers/:id', async (req, res) => {
    try {
      const dossier = await Dossier.findByPk(req.params.id, {
        include:  [
          {
            model: Utilisateur,
            attributes: ['matricule','role']
          },
          {
            model: InfoIdent,
            attributes: [
              'cnss', 'nom', 'prenom', 'nom_du_conjoint', 'sexe', 'dat_nat', 'lieu_nat', 
              'situat_matri', 'dat_mariage', 'nbre_enfants'
            ]
          },
          {
            model: InfoPro,
            attributes: [
              'statut', 'corps', 'categorie', 'branche_du_personnel', 'fonctions', 'ref_nomination',
              'dat_prise_fonction', 'responsabilite_partiuliere', 'grade_paye', 'indice_paye', 
              'dat_first_prise_de_service', 'dat_de_depart_retraite', 'dat_de_prise_service_dans_departement',
              'ref_acte_de_prise_service_poste_actuel', 'poste_actuel_service', 'type_structure', 
              'zone_sanitaire', 'poste_specifique', 'etat_depart', 'poste_anterieurs', 'autres_diplome'
            ]
          },
          {
            model: InfoBank,
            attributes: [
              'rib', 'mtn', 'celtics', 'libercom', 'email'
            ]
          },
          {
            model: InfoComplementaire,
            attributes: [
              'observation_particuliere', 'distinction', 'ref_distinction', 'detail_distinction',
              'situat_sante', 'saction_punitive', 'nature_sanction'
            ]
          }
        ]
      });
      if (dossier) {
        res.json(dossier);
      } else {
        res.status(404).json({ error: 'Dossier not found' });
      }
    } catch (err) {
      console.error('Error fetching dossier', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // Création d'un dossier
  router.post('/dossiers', async (req, res) => {
    const { matricule, id_infoi, id_infop, id_infob, id_infoc } = req.body;
  
    try {
      // Créer les informations identité, professionnelles, bancaires et complémentaires si nécessaires
      const infoIdent = await InfoIdent.create(req.body.infoIdent); // Assurez-vous d'adapter cela à votre structure de données
      const infoPro = await InfoPro.create(req.body.infoPro);
      const infoBank = await InfoBank.create(req.body.infoBank);
      const infoComplementaire = await InfoComplementaire.create(req.body.infoComplementaire);
  
      // Créer le dossier avec les références aux informations créées
      const dossier = await Dossier.create({
        matricule,
        id_infoi: infoIdent.id_infoi,
        id_infop: infoPro.id_infop,
        id_infob: infoBank.id_infob,
        id_infoc: infoComplementaire.id_infoc
      });
     
      const notification = await Notification.create({
        message: `Nouveau dossier créé pour l'employé ayant pour matricule : ${dossier.matricule}`,
        user_id: dossier.matricule,
      });
  
      // Émettre une notification via Socket.io
      getIo().emit('receiveNotification', notification);

      res.status(201).json(dossier);
    } catch (err) {
      console.error('Error creating dossier', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  // Mettre à jour un dossier
  router.put('/dossiers/:id_dossier', async (req, res) => {
    const { id_dossier } = req.params;
  
    try {
      // Vérifier si le dossier existe
      const dossier = await Dossier.findByPk(id_dossier);
      if (!dossier) {
        return res.status(404).json({ error: 'Dossier not found' });
      }
  
      // Mettre à jour les informations identité, professionnelles, bancaires, et complémentaires si nécessaires
      if (req.body.infoIdent) {
        await InfoIdent.update(req.body.infoIdent, { where: { id_infoi: dossier.id_infoi } });
      }
      if (req.body.infoPro) {
        await InfoPro.update(req.body.infoPro, { where: { id_infop: dossier.id_infop } });
      }
      if (req.body.infoBank) {
        await InfoBank.update(req.body.infoBank, { where: { id_infob: dossier.id_infob } });
      }
      if (req.body.infoComplementaire) {
        await InfoComplementaire.update(req.body.infoComplementaire, { where: { id_infoc: dossier.id_infoc } });
      }
  
      // Mettre à jour le dossier lui-même
      const updatedDossier = await Dossier.update(req.body, {
        where: { id_dossier },
        returning: true // pour obtenir le dossier mis à jour
      });

     // Enregistrer une notification dans la base de données
    const notification = await Notification.create({
      message: `Dossier ${id_dossier} mis à jour : `,
      user_id: dossier.matricule,
    });

    // Émettre une notification via Socket.io
    getIo().emit('receiveNotification', notification);

      console.log(updatedDossier[1][0]);
      res.json(updatedDossier[1][0]); // renvoie le premier dossier mis à jour
    } catch (err) {
      console.error('Error updating dossier', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Supprimer un dossier
  router.delete('/dossiers/:id', async (req, res) => {
    try {
      const dossier = await Dossier.findByPk(req.params.id);
      const notification = await Notification.create({
        message: `Dossier ${dossier.id_dossier} supprimé :`,
        user_id: dossier.matricule,
      });
      
      // Émettre une notification via Socket.io
      getIo().emit('receiveNotification', notification);
      if (dossier) {
        await dossier.destroy();

// Enregistrer une notification dans la base de données

        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Dossier not found' });
      }
    } catch (err) {
      console.error('Error deleting dossier', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
 // Lire un dossier par matricule
 router.get('/dossiers/user/:matricule', async (req, res) => {

  const { matricule} = req.params;
  try {
    const dossier = await Dossier.findOne({
       where: { 
      matricule:matricule }
      
    ,include:  [
        {
          model: Utilisateur,
          attributes: ['matricule','role']
        },
        {
          model: InfoIdent,
          attributes: [
            'cnss', 'nom', 'prenom', 'nom_du_conjoint', 'sexe', 'dat_nat', 'lieu_nat', 
            'situat_matri', 'dat_mariage', 'nbre_enfants'
          ]
        },
        {
          model: InfoPro,
          attributes: [
            'statut', 'corps', 'categorie', 'branche_du_personnel', 'fonctions', 'ref_nomination',
            'dat_prise_fonction', 'responsabilite_partiuliere', 'grade_paye', 'indice_paye', 
            'dat_first_prise_de_service', 'dat_de_depart_retraite', 'dat_de_prise_service_dans_departement',
            'ref_acte_de_prise_service_poste_actuel', 'poste_actuel_service', 'type_structure', 
            'zone_sanitaire', 'poste_specifique', 'etat_depart', 'poste_anterieurs', 'autres_diplome'
          ]
        },
        {
          model: InfoBank,
          attributes: [
            'rib', 'mtn', 'celtics', 'libercom', 'email'
          ]
        },
        {
          model: InfoComplementaire,
          attributes: [
            'observation_particuliere', 'distinction', 'ref_distinction', 'detail_distinction',
            'situat_sante', 'saction_punitive', 'nature_sanction'
          ]
        }
      ]
    });
    
    if (dossier) {
      res.json(dossier);
    } else {
      res.status(404).json({ error: 'Dossier not found' });
    }
  } catch (err) {
    console.error('Error fetching dossier', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});





  module.exports = router;