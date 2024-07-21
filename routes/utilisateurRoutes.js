const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur'); // Assurez-vous que le chemin est correct
const { hashPassword, comparePassword, generateToken,authenticate } = require('../utils/auth'); // Importez vos fonctions utilitaires
const { getIo } = require('../utils/socket');
const Notification = require('../models/notification');


// Lire tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await Utilisateur.findAll();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enregistrement d'un utilisateur
router.post('/users/register', async (req, res) => {
  const { matricule, password, role } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await Utilisateur.create({ matricule, password: hashedPassword, role });

    const notification = await Notification.create({
      message: `Nouveau utilisateur enregistrer : ${user.user_id}`,
      user_id: matricule,
    });

    // Émettre une notification via Socket.io
    getIo().emit('receiveNotification', notification);

    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Connexion d'un utilisateur
router.post('/users/login', async (req, res) => {
  const { matricule, password } = req.body;
  try {
    const user = await Utilisateur.findOne({ where: { matricule } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = generateToken(user);

    res.json({ token, role: user.role, id_user: user.id_user ,matricule:user.matricule});
  } catch (err) {
    console.error('Error logging in', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Lire un utilisateur par ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mettre à jour un utilisateur
router.put('/users/:id', async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.params.id);
    if (user) {
      const { password, role } = req.body;
      const hashedPassword = password ? await hashPassword(password) : user.password;
      await user.update({ password: hashedPassword, role });
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
