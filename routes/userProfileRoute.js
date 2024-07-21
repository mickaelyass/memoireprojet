const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const UserProfile = require('../models/userProfile'); // Assurez-vous que le nom du modèle est correct

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../frontend/public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Endpoint pour l'upload
router.post('/upload', upload.single('profilePhoto'), async (req, res) => {
  const matricule = req.body.matricule; // Assurez-vous que le matricule est envoyé dans le corps de la requête
  const fileUrl = `/uploads/${req.file.filename}`;
  
  try {
    // Insérer ou mettre à jour l'URL de l'image dans la base de données
    const [image,created]=await UserProfile.upsert({ matricule: matricule, profile_image_url: fileUrl });
    res.json({
      message:'File uploeded and url saved successfully',
      filePath:fileUrl
    });
  } catch (error) {
    console.error('Error saving image URL:', error);
    res.status(500).json({ error: 'Failed to save image URL' });
  }
});

router.get('/user/:matricule', async (req, res) => {
  const matricule = req.params.matricule;

  try {
    const userProfile = await UserProfile.findOne({ where: { matricule: matricule } });
    if (userProfile) {
      res.json({ profileImageUrl: userProfile.profile_image_url });
    } else {
      res.status(404).json({ message: 'Profile image not found' });
    }
  } catch (error) {
    console.error('Error fetching image URL:', error);
    res.status(500).json({ error: 'Failed to fetch image URL' });
  }
});


module.exports = router;