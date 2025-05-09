// backend/index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app  = express();
const PORT = process.env.PORT || 3000;
const URI  = process.env.MONGO_URI;

if (!URI) {
  console.error('❌ Debes definir MONGO_URI en .env');
  process.exit(1);
}

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done:  { type: Boolean, default: false }
});
const Task = mongoose.model('Task', taskSchema);

app.use(cors());
app.use(express.json());

// ─── RUTAS CRUD ───────────────────────────────────────────────────────

// Listar todas
app.get('/api/tasks', async (_req, res) => {
  const docs = await Task.find().lean();
  const tasks = docs.map(({ _id, title, done }) => ({
    id:    _id.toString(),
    title,
    done,
  }));
  res.json(tasks)
});

// Crear
app.post('/api/tasks', async (req, res) => {
  const doc = await Task.create({ title: req.body.title });
  res.status(201).json({
    id:    doc._id.toString(),
    title: doc.title,
    done:  doc.done
  });
});

// Toggle done
app.put('/api/tasks/:id', async (req, res) => {
  const t = await Task.findById(req.params.id);
  if (!t) return res.status(404).end();
  t.done = !t.done;
  await t.save();
  res.json({
    id:    t._id.toString(),
    title: t.title,
    done:  t.done
  });
});

// Eliminar
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
