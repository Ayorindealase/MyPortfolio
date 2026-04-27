'use client';

import { useState, useEffect } from 'react';

type Publication = {
  id: string;
  title: string;
  abstract: string | null;
  tags: string[];
  type: string;
  date: string;
  doiUrl: string | null;
  sortOrder: number;
  visible: boolean;
};

const EMPTY: Omit<Publication, 'id'> = {
  title: '',
  abstract: '',
  tags: [],
  type: 'publication',
  date: '',
  doiUrl: '',
  sortOrder: 0,
  visible: true,
};

export default function PublicationsPage() {
  const [items, setItems] = useState<Publication[]>([]);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const res = await fetch('/api/admin/publications');
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    fetch('/api/admin/publications').then((res) => res.json()).then(setItems);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!new URLSearchParams(window.location.search).has('new')) return;
    const timer = window.setTimeout(() => {
      setCreating(true);
      setEditing(null);
      setForm(EMPTY);
      setTagInput('');
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const save = async () => {
    setLoading(true);
    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = { ...form, tags, abstract: form.abstract || null, doiUrl: form.doiUrl || null };
    if (editing) {
      await fetch('/api/admin/publications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...payload }),
      });
    } else {
      await fetch('/api/admin/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setEditing(null);
    setCreating(false);
    setForm(EMPTY);
    setTagInput('');
    await fetchItems();
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this publication?')) return;
    await fetch(`/api/admin/publications?id=${id}`, { method: 'DELETE' });
    await fetchItems();
  };

  const startEdit = (item: Publication) => {
    setEditing(item);
    setCreating(false);
    setForm({ title: item.title, abstract: item.abstract || '', tags: item.tags, type: item.type, date: item.date, doiUrl: item.doiUrl || '', sortOrder: item.sortOrder, visible: item.visible });
    setTagInput(item.tags.join(', '));
  };

  const showForm = editing !== null || creating;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Publications</h1>
        <button
          onClick={() => { setCreating(true); setEditing(null); setForm(EMPTY); setTagInput(''); }}
          className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-4 py-2 rounded transition-colors"
        >
          + Add New
        </button>
      </div>

      {showForm && (
        <div className="bg-[#111118] border border-[#1e1e2e] rounded p-6 mb-6">
          <h2 className="text-sm font-bold text-white mb-4">{editing ? 'Edit Publication' : 'New Publication'}</h2>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Abstract</label>
            <textarea
              rows={4}
              value={form.abstract || ''}
              onChange={(e) => setForm({ ...form, abstract: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Tags (comma-sep)</label>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                {['publication', 'article', 'research'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Date</label>
              <input
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="e.g. 2025"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">DOI URL</label>
              <input
                type="url"
                value={form.doiUrl || ''}
                onChange={(e) => setForm({ ...form, doiUrl: e.target.value })}
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
              <div className="font-semibold text-white text-sm leading-snug">{item.title}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.date} · {item.type}</div>
              {item.tags.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] bg-cyan-400/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono">{tag}</span>
                  ))}
                </div>
              )}
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
