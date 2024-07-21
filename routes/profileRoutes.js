// routes/profileRoutes.js
const express = require('express');
const { Op} = require('sequelize');
const Profile=require('../models/Profile')
const {verifyRole,authenticate} = require("../utils/auth");
// Assurez-vous que le chemin est correct

const router = express.Router();

// Create a new profile
router.post('/profiles', async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (err) {
    console.error('Error creating profile', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all profiles
router.get('/profiles', async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    res.json(profiles);
  } catch (err) {
    console.error('Error fetching profiles', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/profiles/search', async (req, res) => {
  const { name, service } = req.query;
  const whereClause = {};

  if (name) {
    whereClause.nom = {
      [Op.iLike]: `%${name}%`
    };
  }

  if (service) {
    whereClause.poste_actuel_service = {
      [Op.iLike]: `%${service}%`
    };
  }

  console.log('Received query parameters:', req.query);
  console.log('Constructed whereClause:', whereClause);

  try {
    const profiles = await Profile.findAll({ where: whereClause });
    console.log('Profiles found:', profiles);
    res.json(profiles);
  } catch (err) {
    console.error('Error fetching profiles', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Get a profile by ID
router.get('/profiles/:id',async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (err) {
    console.error('Error fetching profile', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a profile by ID
router.put('/profiles/:id', async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (profile) {
      await profile.update(req.body);
      res.json(profile);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (err) {
    console.error('Error updating profile', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a profile by ID
router.delete('/profiles/:id', async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (profile) {
      await profile.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (err) {
    console.error('Error deleting profile', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/profiles/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { user_id: req.params.user_id } });

    if (!profile) {
      return res.status(404).json({ error: 'No profile found for this user ID' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Error fetching profile by user ID', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search profiles

module.exports = router;
