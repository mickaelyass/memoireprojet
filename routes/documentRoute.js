const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Document = require('../models//document'); // Assurez-vous que le nom du modèle est correct
const fs=require('fs');
const { Op } = require('sequelize');
const { getIo } = require('../utils/socket');
const Notification = require('../models/notification');
// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath=path.join(__dirname,'../frontend/public/doc');
    if(!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter=(req,file,cb)=>{
    const allowedFileTypes=/jpeg|jpg|png|gif|pdf|mp4|mp3/;
    const extname=allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/jpeg|image\/jpg|image\/png|image\/gif|application\/pdf|video\/mp4|audio\/mpeg/.test(file.mimetype);

    if(extname && mimetype){
        return cb(null,true);
    }else{
        cb('Error:File type no allowed');
    }
}

const doc = multer({ 
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize:50*1024*1024}

});

// Endpoint pour l'upload
router.post('/doc', doc.single('file'), async (req, res) => {
  const matricule = req.body.matricule; // Assurez-vous que le matricule est envoyé dans le corps de la requête
  const fileUrl = `/doc/${req.file.filename}`;
  const fileName=`${req.file.filename}`;
  
  try {
    // Insérer ou mettre à jour l'URL de l'image dans la base de données
    const document=await Document.create({ matricule: matricule, file_url: fileUrl,file_name:fileName });
    
    const notification = await Notification.create({
      message: `Nouveau fichier reçu: ${matricule}`,
      user_id: matricule,
    });

    // Émettre une notification via Socket.io
    getIo().emit('receiveNotification', notification);
    res.json({
     document:document,
      message:'File uploeded and url saved successfully',
      
    });
  } catch (error) {
    console.error('Error saving image URL:', error);
    res.status(500).json({ error: 'Failed to save file URL' });
  }
});

router.get('/user/file/:matricule', async (req, res) => {
  const matricule = req.params.matricule;

  try {
    const document = await Document.findAll({ where: { matricule: matricule } });
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ message: 'Document non trouvé' });
    }
  } catch (error) {
    console.error('Error fetching document URL:', error);
    res.status(500).json({ error: 'Failed to fetch file URL' });
  }
});


module.exports = router;