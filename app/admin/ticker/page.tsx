'use client';

import { useState, useEffect } from 'react';

type TickerItem = {
  id: string;
  text: string;
  color: string;
  active: boolean;
  sortOrder: number;
};

const EMPTY: Omit<TickerItem, 'id'> = {
  text: '',
  color: 'var(--cyan)',
  active: true,
  sortOrder: 0,
};

export default function TickerPage() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [editing, setEditing] = useState<TickerItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const res = await fetch('/api/admin/ticker');
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    fetch('/api/admin/ticker').then((res) => res.json()).then(setItems);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!new URLSearchParams(window.location.search).has('new')) return;
    const timer = window.setTimeout(() => {
      setCreating(true);
      setEditing(null);
      setForm(EMPTY);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const save = async () => {
    setLoading(true);
    if (editing) {
      await fetch('/api/admin/ticker', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...form }),
      });
    } else {
      await fetch('/api/admin/ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setEditing(null);
    setCreating(false);
    setForm(EMPTY);
    await fetchItems();
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this ticker item?')) return;
    await fetch(`/api/admin/ticker?id=${id}`, { method: 'DELETE' });
    await fetchItems();
  };

  const startEdit = (item: TickerItem) => {
    setEditing(item);
    setCreating(false);
    setForm({ text: item.text, color: item.color, active: item.active, sortOrder: item.sortOrder });
  };

  const showForm = editing !== null || creating;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Ticker Items</h1>
        <button
          onClick={() => { setCreating(true); setEditing(null); setForm(EMPTY); }}
          className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-4 py-2 rounded transition-colors"
        >
          + Add New
        </button>
      </div>

      {showForm && (
        <div className="bg-[#111118] border border-[#1e1e2e] rounded p-6 mb-6">
          <h2 className="text-sm font-bold text-white mb-4">{editing ? 'Edit Item' : 'New Item'}</h2>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Text</label>
            <input
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Color</label>
              <select
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="var(--cyan)">Cyan</option>
                <option value="var(--green)">Green</option>
                <option value="var(--amber)">Amber</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <label htmlFor="active" className="text-sm text-gray-400">Active</label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-sm font-bold px-4 py-2 rounded transition-colors"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(null); setCreating(false); }}
              className="bg-[#1e1e2e] hover:bg-[#2a2a3e] text-white text-sm px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-[#111118] border border-[#1e1e2e] rounded p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm text-white truncate">{item.text}</div>
              <div className="text-xs text-gray-500 mt-0.5">color: {item.color}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${item.active ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-800'}`}>
                {item.active ? 'active' : 'inactive'}
              </span>
              <button onClick={() => startEdit(item)} className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 border border-cyan-400/30 rounded">Edit</button>
              <button onClick={() => deleteItem(item.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-400/30 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
