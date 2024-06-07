const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const room = urlParams.get('room');
console.log(`Nome de usuário: ${username}, Sala: ${room}`);
const socket = io();

socket.emit('join room', { room, username });

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', { room, msg: input.value, username });
    input.value = '';
  }
});

socket.on('previous messages', (msgs) => {
  msgs.forEach((msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
  });
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
