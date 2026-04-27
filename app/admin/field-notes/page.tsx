/* eslint-disable @next/next/no-img-element */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type FieldNote = {
  id: string;
  title: string;
  slug: string;
  type: string;
  content: string;
  abstract: string | null;
  tags: string[];
  isPublished: boolean;
};

export default function FieldNotesAdminPage() {
  const [items, setItems] = useState<FieldNote[]>([]);

  useEffect(() => {
    fetch('/api/admin/writings')
      .then((r) => r.json())
      .then((data: FieldNote[]) => setItems(data.filter((item) => item.type === 'gallery')));
  }, []);

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this gallery entry?')) return;
    await fetch(`/api/admin/writings?id=${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const togglePublish = async (item: FieldNote) => {
    await fetch('/api/admin/writings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, isPublished: !item.isPublished }),
    });
    setItems((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, isPublished: !entry.isPublished } : entry));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Field Notes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage photo cards for the public gallery page.</p>
        </div>
        <Link
          href="/admin/field-notes/new"
          className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-4 py-2 rounded transition-colors"
        >
          + New Photo Card
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-[#111118] border border-[#1e1e2e] rounded p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <img src={item.content} alt={item.title} className="h-16 w-16 rounded object-cover border border-[#1e1e2e]" />
              <div className="min-w-0">
                <div className="font-semibold text-white text-sm truncate">{item.title}</div>
                <div className="text-xs text-gray-500 truncate">{item.abstract || item.slug}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => togglePublish(item)}
                className={`text-xs px-2 py-0.5 rounded font-mono ${item.isPublished ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-800'}`}
              >
                {item.isPublished ? 'published' : 'draft'}
              </button>
              <Link href={`/admin/field-notes/${item.id}`} className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 border border-cyan-400/30 rounded">Edit</Link>
              <button onClick={() => deleteItem(item.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-400/30 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
