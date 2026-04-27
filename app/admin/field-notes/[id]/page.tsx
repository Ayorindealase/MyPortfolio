/* eslint-disable @next/next/no-img-element */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

type FieldNoteForm = {
  title: string;
  slug: string;
  content: string;
  abstract: string;
  tags: string[];
  isPublished: boolean;
  sortOrder: number;
};

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function FieldNoteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [form, setForm] = useState<FieldNoteForm>({
    title: '',
    slug: '',
    content: '',
    abstract: '',
    tags: [],
    isPublished: false,
    sortOrder: 0,
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch('/api/admin/writings')
        .then((r) => r.json())
        .then((items) => {
          const item = items.find((entry: { id: string; type: string }) => entry.id === params.id && entry.type === 'gallery');
          if (!item) return;
          setForm({
            title: item.title,
            slug: item.slug,
            content: item.content,
            abstract: item.abstract || '',
            tags: item.tags || [],
            isPublished: item.isPublished,
            sortOrder: item.sortOrder || 0,
          });
          setTagInput((item.tags || []).join(', '));
        });
    }
  }, [isNew, params.id]);

  const save = async () => {
    setLoading(true);
    const payload = {
      ...form,
      tags: tagInput.split(',').map((tag) => tag.trim()).filter(Boolean),
      type: 'gallery',
      readingTime: 0,
      publishedDate: new Date().toISOString(),
    };

    if (isNew) {
      await fetch('/api/admin/writings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/admin/writings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, ...payload }),
      });
    }

    setLoading(false);
    router.push('/admin/field-notes');
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/field-notes" className="text-gray-400 hover:text-white text-sm">← Field Notes</Link>
        <h1 className="text-xl font-bold text-white">{isNew ? 'New Photo Card' : 'Edit Photo Card'}</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value, slug: prev.slug || slugify(e.target.value) }))}
            className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Image URL</label>
          <input
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="https://..."
            className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Sort Order</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Caption / Note</label>
        <textarea
          rows={3}
          value={form.abstract}
          onChange={(e) => setForm({ ...form, abstract: e.target.value })}
          className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Tags (comma-sep)</label>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div className="flex items-end gap-2">
          <input
            type="checkbox"
            id="published"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
          />
          <label htmlFor="published" className="text-sm text-gray-400">Published</label>
        </div>
      </div>

      {form.content && (
        <div className="mb-6 rounded border border-[#1e1e2e] bg-[#111118] p-3">
          <img src={form.content} alt={form.title || 'Preview'} className="max-h-[320px] w-full rounded object-cover" />
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-sm font-bold px-6 py-2 rounded transition-colors"
        >
          {loading ? 'Saving...' : 'Save Photo Card'}
        </button>
        <Link
          href="/admin/field-notes"
          className="bg-[#1e1e2e] hover:bg-[#2a2a3e] text-white text-sm px-4 py-2 rounded transition-colors"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
