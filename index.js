const express = require('express');
const bodyParser = require('body-parser');
const utilisteurRoutes = require('./routes/utilisateurRoutes');
const dossierRoutes = require('./routes/dossierRoutes');
const congeRoutes = require('./routes/congeRoutes');
const cors =require('cors');
const  sequelize  = require('./db'); 
const http = require('http');
const socketIo = require('socket.io');
const Notification = require('./models/notification'); 
const { init: initSocket } = require('./utils/socket');
const path =require( 'path');

const app = express();
const uploadRouter = require('./routes/userProfileRoute');

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname,'frontend/public/uploads'))); // Sert les fichiers dans le répertoire uploads

const server = http.createServer(app);
initSocket(server); // Initialiser Socket.io avec le serveur


// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', uploadRouter);
app.use('/api', utilisteurRoutes);
app.use('/api', dossierRoutes);
app.use('/api', congeRoutes);


// Démarrer le serveur
const port = process.env.PORT || 3003;
sequelize.authenticate()
    .then(()=> {
        console.log('connexion has been established successfully');
        return sequelize.sync();
    })
    .then(()=>{
        server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

})
    .catch(err=>{
      console.error('Unable to connect to the database',err);
    });
