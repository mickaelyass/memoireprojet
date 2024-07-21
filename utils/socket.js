// utils/socket.js
let io;

const init = (server) => {
  io = require('socket.io')(server, {
    cors: {
      origin: '*', // Permettre les requêtes CORS
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Nouveau client connecté');

    socket.on('disconnect', () => {
      console.log('Client déconnecté');
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io n'est pas initialisé");
  }
  return io;
};

module.exports = { init, getIo };
