// routes/userRoutes.js
const express = require('express');
const  next=require('express');
const { generateToken, hashPassword, comparePassword, verifyToken } = require('../utils/auth');
const router = express.Router();
const User=require('../models/User');
const passport = require('passport');

// Middleware pour vérifier le token JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Failed to authenticate token' });
  }
};
 //passport middleware

// Register a new user
router.post('/users/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login a user
router.post('/users/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password', });
         console.log(user);
    const token = generateToken(user);

     res.json({ token,role:user.role,id:user.id });
  } catch (err) {
    console.error('Error logging in', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CRUD routes for users (only accessible by admin)
router.get('/users',async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users/:id',async (req, res) => {
 console.log(req);
//if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  try {
    const user = await User.findByPk(req.params.id);

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

router.put('/users/:id', async (req, res) => {

  try {
    const user = await User.findByPk(req.params.id);
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

router.delete('/users/:id', async (req, res) => {
 // if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  try {
    const user = await User.findByPk(req.params.id);
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
