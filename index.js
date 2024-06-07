const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { insertMessage, getMessagesByRoom } = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});


io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  socket.on('join room', async ({ room, username }) => {
    console.log(`Usuário ${username} tentando entrar na sala ${room}`);
    if (room === 'Python' || room === 'Java' || room === 'Node') {
      socket.join(room);
      const messages = await getMessagesByRoom(room); 
      socket.emit('previous messages', messages.map(msg => msg.message)); 
      socket.to(room).emit('chat message', `${username} entrou na sala ${room}`);
    } else {
      console.error(`Sala ${room} não existe.`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  socket.on('chat message', async ({ room, msg, username }) => {
    console.log(`Mensagem recebida na sala ${room}: ${msg}`);
    if (room === 'Python' || room === 'Java' || room === 'Node') {
      const message = `${username}: ${msg}`;
      io.to(room).emit('chat message', message);
      await insertMessage({ room, username, message });
    } else {
      console.error(`Sala ${room} não existe.`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
