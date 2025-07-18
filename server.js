import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const port = 5000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

async function askGemini(query) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent(query);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Error:', error);
    return "I'm having trouble processing your request right now.";
  }
}

app.post('/text_input', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text input is required' });
    const response = await askGemini(text);
    res.json({ response });
  } catch (error) {
    console.error('Text input error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.emit("response", { sender: "GENIUS", text: "Connected to Genius backend." });

  socket.on('user_command', async ({ text }) => {
    console.log(`Received from client: ${text}`);
    const reply = await askGemini(text);
    socket.emit('response', { sender: 'GENIUS', text: reply });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});