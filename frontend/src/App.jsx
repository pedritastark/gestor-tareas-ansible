import { useEffect, useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  /* GET inicial */
  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

  /* POST para agregar */
  const addTask = async () => {
    if (!title.trim()) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, done: false })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTitle('');
  };

  return (
    <main style={{ maxWidth: 600, margin: '3rem auto', fontFamily: 'Arial' }}>
      <h1>Gestor de Tareas</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Nueva tarea"
          style={{ padding: 8, width: '70%' }}
        />
        <button onClick={addTask} style={{ padding: 8, marginLeft: 8 }}>
          Añadir
        </button>
      </div>

      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            {t.title} {t.done ? '✅' : ''}
          </li>
        ))}
      </ul>
    </main>
  );
}
