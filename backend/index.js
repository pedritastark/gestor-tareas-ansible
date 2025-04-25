const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Base de datos “de juguete” en memoria:
let tasks = [
  { id: 1, title: 'Aprender Ansible', done: false },
  { id: 2, title: 'Configurar EC2', done: true }
];

// Endpoints CRUD mínimos
app.get('/api/tasks', (_req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
  const task = { id: Date.now(), ...req.body };
  tasks.push(task);
  res.status(201).json(task);
});

app.listen(PORT, () =>
  console.log(`API escuchando en http://localhost:${PORT}`)
);
