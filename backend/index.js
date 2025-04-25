// backend/index.js
const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// “Base de datos” en memoria
let tasks = [
  { id: 1, title: 'Aprender Ansible', done: false },
  { id: 2, title: 'Configurar EC2',    done: true  }
];

// ─────────── Rutas CRUD ──────────────────────────────────────────

// Listar
app.get('/api/tasks', (_req, res) => res.json(tasks));

// Crear
app.post('/api/tasks', (req, res) => {
  const task = { id: Date.now(), ...req.body, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Marcar / des-marcar
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.map(t =>
    t.id === Number(id) ? { ...t, done: !t.done } : t
  );
  const updated = tasks.find(t => t.id === Number(id));
  res.json(updated);
});

// Eliminar
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(t => t.id !== Number(id));
  res.status(204).end();
});

app.listen(PORT, () =>
  console.log(`API escuchando en http://localhost:${PORT}`)
);
