
const express = require('express');
const { Op} = require('sequelize');
const Conge=require('../models/demandeConge');
const { getIo } = require('../utils/socket');
const router = express.Router();
const Notification = require('../models/notification');
// Route pour obtenir toutes les demandes de congé
router.get('/conges', async (req, res) => {
  try {
    const conges = await Conge.findAll(
    );
    res.json(conges);
    console.log(conges);
  } catch (err) {
    console.error('Error fetching leave requests', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Lire un utilisateur par ID
router.get('/Conges/:id', async (req, res) => {
  try {
    const conge = await Conge.findByPk(req.params.id);
    if (conge) {
      res.json(conge);
    } else {
      res.status(404).json({ error: 'Conge not found' });
    }
  } catch (err) {
    console.error('Error fetching user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route pour créer une nouvelle demande de congé
router.post('/conges', async (req, res) => {
  try {
    const leave = await Conge.create(req.body);
    
 // Enregistrer une notification dans la base de données
 const notification = await Notification.create({
  message: `Nouvelle demande de congé soumis par l'employe ayant pour matricule : ${leave.matricule}`,
  user_id: leave.matricule,
});

// Émettre une notification via Socket.io
getIo().emit('receiveNotification', notification);

    res.status(201).json(leave);
  } catch (err) {
    console.error('Error creating leave request', err);
    res.status(400).json({ error: 'Bad request' });
  }
});

// Route pour obtenir les demandes de congé pour un utilisateur spécifique
router.get('/conges/user/:matricule', async (req, res) => {
  try {
    const conges = await Conge.findAll({ where: { matricule: req.params.matricule } });
    res.json(conges);
  } catch (err) {
    console.error('Error fetching leave requests for user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Route pour mettre à jour le statut d'une demande de congé
router.put('/conges/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedConge = await Conge.update(req.body, {
      where: { id_cong: id },
    });

    if (updatedConge[0] === 1) {
      const conge = await Conge.findByPk(id);
       // Enregistrer une notification dans la base de données
      const notification = await Notification.create({
        message: `Demande de congé ${id} mise à jour :`,
        user_id: conge.matricule,
      });

      // Émettre une notification via Socket.io
      getIo().emit('receiveNotification', notification);

      res.json(conge);
    } else {
      res.status(404).json({ error: 'Congé not found' });
    }
  } catch (error) {
    console.error('Error updating leave request', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;