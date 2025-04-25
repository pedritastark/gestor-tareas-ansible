import { useEffect, useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const API = '/api/tasks';

  /* cargar tareas */
  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

  /* añadir */
  const addTask = async () => {
    if (!title.trim()) return;
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    const nueva = await res.json();
    setTasks([...tasks, nueva]);
    setTitle('');
  };

  /* toggle done */
  const toggle = async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'PUT' });
    const upd = await res.json();
    setTasks(tasks.map(t => (t.id === id ? upd : t)));
  };

  /* eliminar */
  const remove = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <main
      style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '1rem'
      }}
    >
      <h1 style={{ textAlign: 'center', margin: '0 0 1rem' }}>
        Gestor de Tareas
      </h1>

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
        <input
          style={{ padding: 8, width: '70%' }}
          placeholder="Nueva tarea"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') addTask();
          }}
        />
        <button onClick={addTask} style={{ padding: 8, marginLeft: 8 }}>
          Añadir
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t => (
          <li
            key={t.id}
            style={{
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
                style={{ marginRight: 8 }}
              />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
                {t.title}
              </span>
            </div>
            <button onClick={() => remove(t.id)} style={{ marginLeft: 12 }}>
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
