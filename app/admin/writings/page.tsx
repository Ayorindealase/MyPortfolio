'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Writing = {
  id: string;
  title: string;
  slug: string;
  type: string;
  isPublished: boolean;
  publishedDate: string;
  readingTime?: number;
};

export default function WritingsPage() {
  const [items, setItems] = useState<Writing[]>([]);

  useEffect(() => {
    fetch('/api/admin/writings').then((r) => r.json()).then(setItems);
  }, []);

  const togglePublish = async (item: Writing) => {
    await fetch('/api/admin/writings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, isPublished: !item.isPublished }),
    });
    setItems((prev) => prev.map((w) => w.id === item.id ? { ...w, isPublished: !w.isPublished } : w));
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await fetch(`/api/admin/writings?id=${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Writings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage on-site articles and external Medium links from one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/writings/new?type=external"
            className="bg-amber-500/90 hover:bg-amber-400 text-black text-sm font-bold px-4 py-2 rounded transition-colors"
          >
            + Medium Link
          </Link>
          <Link
            href="/admin/writings/new"
            className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-4 py-2 rounded transition-colors"
          >
            + New Writing
          </Link>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-[#111118] border border-[#1e1e2e] rounded p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm truncate">{item.title}</div>
              <div className="text-xs text-gray-400 font-mono mt-0.5">{item.slug}</div>
              <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-wider">{item.type}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => togglePublish(item)}
                className={`text-xs px-2 py-0.5 rounded font-mono ${item.isPublished ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-800'}`}
              >
                {item.isPublished ? 'published' : 'draft'}
              </button>
              <Link href={`/admin/writings/${item.id}`} className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 border border-cyan-400/30 rounded">Edit</Link>
              <button onClick={() => deleteItem(item.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-400/30 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
