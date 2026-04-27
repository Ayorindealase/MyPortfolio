'use client';

import { useState, useEffect } from 'react';

type Profile = {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  companyName: string;
  companyUrl: string;
  philosophy: string;
  resumeUrl?: string;
};

export default function ProfilePage() {
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/profile').then((r) => r.json()).then(setForm);
  }, []);

  const save = async () => {
    setLoading(true);
    await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const FIELDS: Array<{ key: keyof Profile; label: string; type?: string }> = [
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Title' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'location', label: 'Location' },
    { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
    { key: 'githubUrl', label: 'GitHub URL', type: 'url' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'companyUrl', label: 'Company URL', type: 'url' },
    { key: 'resumeUrl', label: 'Resume URL', type: 'url' },
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-6">Profile Settings</h1>
      <div className="bg-[#111118] border border-[#1e1e2e] rounded p-6 space-y-4">
        {FIELDS.map(({ key, label, type = 'text' }) => (
          <div key={key}>
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{label}</label>
            <input
              type={type}
              value={(form[key] as string) || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>
        ))}
        {(['bio', 'philosophy'] as const).map((key) => (
          <div key={key}>
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{key}</label>
            <textarea
              rows={4}
              value={(form[key] as string) || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>
        ))}
        <button
          onClick={save}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-sm font-bold px-6 py-2 rounded transition-colors"
        >
          {saved ? 'Saved!' : loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
