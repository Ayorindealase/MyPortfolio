'use client';

import { useState, useEffect } from 'react';

type LeadershipRole = {
  id: string;
  title: string;
  organization: string;
  description: string;
  accentColor: string;
  link: string | null;
  sortOrder: number;
  visible: boolean;
};

const EMPTY: Omit<LeadershipRole, 'id'> = {
  title: '',
  organization: '',
  description: '',
  accentColor: 'cyan',
  link: '',
  sortOrder: 0,
  visible: true,
};

export default function LeadershipPage() {
  const [items, setItems] = useState<LeadershipRole[]>([]);
  const [editing, setEditing] = useState<LeadershipRole | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const res = await fetch('/api/admin/leadership');
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    fetch('/api/admin/leadership').then((res) => res.json()).then(setItems);
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
    const payload = { ...form, link: form.link || null };
    if (editing) {
      await fetch('/api/admin/leadership', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...payload }),
      });
    } else {
      await fetch('/api/admin/leadership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setEditing(null);
    setCreating(false);
    setForm(EMPTY);
    await fetchItems();
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this role?')) return;
    await fetch(`/api/admin/leadership?id=${id}`, { method: 'DELETE' });
    await fetchItems();
  };

  const startEdit = (item: LeadershipRole) => {
    setEditing(item);
    setCreating(false);
    setForm({ title: item.title, organization: item.organization, description: item.description, accentColor: item.accentColor, link: item.link || '', sortOrder: item.sortOrder, visible: item.visible });
  };

  const showForm = editing !== null || creating;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Leadership</h1>
        <button
          onClick={() => { setCreating(true); setEditing(null); setForm(EMPTY); }}
          className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-4 py-2 rounded transition-colors"
        >
          + Add New
        </button>
      </div>

      {showForm && (
        <div className="bg-[#111118] border border-[#1e1e2e] rounded p-6 mb-6">
          <h2 className="text-sm font-bold text-white mb-4">{editing ? 'Edit Role' : 'New Role'}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Organization</label>
              <input
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Accent Color</label>
              <select
                value={form.accentColor}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                {['cyan', 'green', 'amber', 'red'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Link (optional)</label>
              <input
                type="url"
                value={form.link || ''}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
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
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="visible"
              checked={form.visible}
              onChange={(e) => setForm({ ...form, visible: e.target.checked })}
            />
            <label htmlFor="visible" className="text-sm text-gray-400">Visible</label>
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
          <div key={item.id} className="bg-[#111118] border border-[#1e1e2e] rounded p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">{item.title}</div>
              <div className="text-xs text-gray-400">{item.organization}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${item.visible ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-800'}`}>
                {item.visible ? 'visible' : 'hidden'}
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
