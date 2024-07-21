// utils/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/utilisateur');

const SECRET_KEY = 'DAMSO'; // Remplacez par une clé secrète forte

const generateToken = (user) => {
  return jwt.sign({ id: user.id_user, role: user.role,matricule:user.matricule }, SECRET_KEY, { expiresIn: '1h' });

};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, 'cr7');
    const user = await Utilisateur.findByPk(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};




module.exports = { generateToken, hashPassword, comparePassword, verifyToken,authenticate };
