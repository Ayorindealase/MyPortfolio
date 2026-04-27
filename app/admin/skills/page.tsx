'use client';

import { useState, useEffect } from 'react';

type Skill = {
  id: string;
  name: string;
  category: string;
  sortOrder: number;
  visible: boolean;
};

const EMPTY: Omit<Skill, 'id'> = {
  name: '',
  category: 'core_ml',
  sortOrder: 0,
  visible: true,
};

const CATEGORIES = [
  { value: 'core_ml', label: 'Core ML' },
  { value: 'ai_systems', label: 'AI Systems' },
  { value: 'data', label: 'Data' },
  { value: 'infrastructure', label: 'Infrastructure' },
];

export default function SkillsPage() {
  const [items, setItems] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const res = await fetch('/api/admin/skills');
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    fetch('/api/admin/skills').then((res) => res.json()).then(setItems);
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
      await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, ...form }),
      });
    } else {
      await fetch('/api/admin/skills', {
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
    if (!confirm('Delete this skill?')) return;
    await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' });
    await fetchItems();
  };

  const startEdit = (item: Skill) => {
    setEditing(item);
    setCreating(false);
    setForm({ name: item.name, category: item.category, sortOrder: item.sortOrder, visible: item.visible });
  };

  const showForm = editing !== null || creating;

  // Group by category
  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    skills: items.filter((s) => s.category === cat.value),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Skills</h1>
        <button
          onClick={() => { setCreating(true); setEditing(null); setForm(EMPTY); }}
          className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-4 py-2 rounded transition-colors"
        >
          + Add New
        </button>
      </div>

      {showForm && (
        <div className="bg-[#111118] border border-[#1e1e2e] rounded p-6 mb-6">
          <h2 className="text-sm font-bold text-white mb-4">{editing ? 'Edit Skill' : 'New Skill'}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
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

      <div className="space-y-6">
        {grouped.map((group) => (
          <div key={group.value}>
            <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">{group.label}</h2>
            <div className="space-y-1">
              {group.skills.map((item) => (
                <div key={item.id} className="bg-[#111118] border border-[#1e1e2e] rounded p-3 flex items-center justify-between gap-4">
                  <div className="font-semibold text-white text-sm">{item.name}</div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${item.visible ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-800'}`}>
                      {item.visible ? 'visible' : 'hidden'}
                    </span>
                    <button onClick={() => startEdit(item)} className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 border border-cyan-400/30 rounded">Edit</button>
                    <button onClick={() => deleteItem(item.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-400/30 rounded">Delete</button>
                  </div>
                </div>
              ))}
              {group.skills.length === 0 && (
                <div className="text-xs text-gray-600 italic px-3 py-2">No skills in this category</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
