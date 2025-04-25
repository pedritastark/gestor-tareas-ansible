// backend/index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app  = express();
const PORT = process.env.PORT || 3000;
const URI  = process.env.MONGO_URI;

if (!URI) {
  console.error('❌ MONGO_URI no está definido en .env');
  process.exit(1);
}

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ MongoDB conectado');

    // Sembrar sólo si no hay tareas
    const Task = mongoose.model('Task');
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany([
        { title: 'Aprender Ansible', done: false },
        { title: 'Configurar EC2',    done: true  }
      ]);
      console.log('🌱 Tareas iniciales sembradas');
    }
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

// Define tu esquema y modelo
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done:  { type: Boolean, default: false }
});
mongoose.model('Task', taskSchema);

app.use(cors());
app.use(express.json());

// CRUD routes

app.get('/api/tasks', async (_req, res) => {
  const Task = mongoose.model('Task');
  res.json(await Task.find().lean());
});

app.post('/api/tasks', async (req, res) => {
  const Task = mongoose.model('Task');
  const t = await Task.create({ title: req.body.title });
  res.status(201).json(t);
});

app.put('/api/tasks/:id', async (req, res) => {
  const Task = mongoose.model('Task');
  const t = await Task.findById(req.params.id);
  if (!t) return res.status(404).end();
  t.done = !t.done;
  await t.save();
  res.json(t);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const Task = mongoose.model('Task');
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.listen(PORT, () =>
  console.log(`API escuchando en http://localhost:${PORT}`)
);
