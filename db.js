const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectToDB() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
    return client.db('chatApp'); 
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
}

const messageSchema = {
  room: String,
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
};

async function insertMessage(message) {
  const db = await connectToDB();
  const collection = db.collection('messages');
  await collection.insertOne(message);
  console.log('Mensagem inserida no banco de dados:', message);
}

async function getMessagesByRoom(room) {
  const db = await connectToDB();
  const collection = db.collection('messages');
  return await collection.find({ room }).toArray();
}

module.exports = { connectToDB, messageSchema, insertMessage, getMessagesByRoom };
