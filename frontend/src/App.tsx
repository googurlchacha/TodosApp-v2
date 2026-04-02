import { useCallback, useEffect, useState } from 'react';

type Todo = { id: string; title: string; done: boolean; createdAt: string };

const api = (path: string, init?: RequestInit) => fetch(path, init);

export default function App() {
  const [items, setItems] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    const r = await api('/api/todos');
    if (!r.ok) {
      setErr('Could not load todos.');
      return;
    }
    setItems(await r.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setErr(null);
    const r = await api('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: t }),
    });
    if (!r.ok) {
      setErr('Could not add todo.');
      return;
    }
    setTitle('');
    await load();
  }

  async function toggle(id: string) {
    setErr(null);
    const r = await api(`/api/todos/${id}/toggle`, { method: 'PATCH' });
    if (!r.ok) {
      setErr('Could not update todo.');
      return;
    }
    await load();
  }

  async function remove(id: string) {
    setErr(null);
    const r = await api(`/api/todos/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      setErr('Could not delete todo.');
      return;
    }
    await load();
  }

  return (
    <>
      <h1>Todo Application</h1>
      {err && <p className="error">{err}</p>}
      <form onSubmit={add}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo"
          maxLength={500}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map((t) => (
          <li key={t.id}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span className={t.done ? 'done' : ''}>{t.title}</span>
            <button type="button" className="secondary" onClick={() => remove(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
