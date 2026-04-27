'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Writing = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  abstract: string;
  tags: string[];
  type: string;
  isPublished: boolean;
  readingTime: number;
};

function calcReadingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function WritingEditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isNew = params.id === 'new';
  const requestedType = searchParams.get('type');

  const [form, setForm] = useState<Writing>({
    title: '',
    slug: '',
    content: '',
    abstract: '',
    tags: [],
    type: requestedType === 'external' ? 'external' : 'article',
    isPublished: false,
    readingTime: requestedType === 'external' ? 0 : 1,
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (isNew) return;

    if (!isNew) {
      fetch('/api/admin/writings').then((r) => r.json()).then((items: (Writing & { id: string })[]) => {
        const item = items.find((w) => w.id === params.id);
        if (item) {
          setForm(item);
          setTagInput(item.tags.join(', '));
        }
      });
    }
  }, [isNew, params.id]);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || slugify(title),
    }));
  };

  const handleContentChange = (content: string) => {
    setForm((prev) => ({
      ...prev,
      content,
      readingTime: prev.type === 'external' ? 0 : calcReadingTime(content),
    }));
  };

  const save = async () => {
    setLoading(true);
    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = { ...form, tags };

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
    router.push('/admin/writings');
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/writings" className="text-gray-400 hover:text-white text-sm">← Writings</Link>
        <h1 className="text-xl font-bold text-white">
          {isNew ? (form.type === 'external' ? 'New External Writing' : 'New Writing') : 'Edit Writing'}
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Title</label>
          <input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
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
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Type</label>
          <select
            value={form.type}
            onChange={(e) => {
              const type = e.target.value;
              setForm((prev) => ({
                ...prev,
                type,
                readingTime: type === 'external' ? 0 : calcReadingTime(prev.content),
              }));
            }}
            className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            {['article', 'research', 'publication', 'external'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Tags (comma-sep)</label>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div className="flex items-end gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pub"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            <label htmlFor="pub" className="text-sm text-gray-400">Published</label>
          </div>
          {form.type !== 'external' && (
            <div className="text-xs text-gray-500 font-mono">{form.readingTime} min read</div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Abstract</label>
        <textarea
          rows={2}
          value={form.abstract}
          onChange={(e) => setForm({ ...form, abstract: e.target.value })}
          placeholder={form.type === 'external' ? 'Short description for the Medium/external article card' : undefined}
          className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider">
            {form.type === 'external' ? 'External URL' : 'Content (MDX)'}
          </label>
          <button
            onClick={() => setPreview(!preview)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
          >
            {preview ? 'EDIT' : 'PREVIEW'}
          </button>
        </div>
        {preview && form.type !== 'external' ? (
          <div
            className="bg-[#111118] border border-[#1e1e2e] rounded p-4 min-h-[400px] text-sm text-gray-300 leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {form.content}
          </div>
        ) : (
          form.type === 'external' ? (
            <input
              value={form.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="https://medium.com/..."
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          ) : (
          <textarea
            rows={20}
            value={form.content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none font-mono"
          />
          )
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-sm font-bold px-6 py-2 rounded transition-colors"
        >
          {loading ? 'Saving...' : 'Save Article'}
        </button>
        <Link
          href="/admin/writings"
          className="bg-[#1e1e2e] hover:bg-[#2a2a3e] text-white text-sm px-4 py-2 rounded transition-colors"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
