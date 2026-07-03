'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PosterPreview from './PosterPreview';

type ProfileInput = {
  id?: string;
  businessName: string;
  tagline: string;
  lipaNumber: string;
  lipaLabel: string;
  repairNumber: string;
  agentCode: string;
  accentColor: string;
};

const emptyProfile: ProfileInput = {
  businessName: '',
  tagline: '',
  lipaNumber: '',
  lipaLabel: 'Lipa Number',
  repairNumber: '',
  agentCode: '',
  accentColor: '#f5c518',
};

export default function ProfileForm({ initial }: { initial?: ProfileInput }) {
  const router = useRouter();
  const [form, setForm] = useState<ProfileInput>(initial ?? emptyProfile);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isEdit = Boolean(initial?.id);

  function update<K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(isEdit ? `/api/profiles/${initial!.id}` : '/api/profiles', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm('Delete this poster? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`/api/profiles/${initial.id}`, { method: 'DELETE' });
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Business Name">
          <input
            required
            value={form.businessName}
            onChange={(e) => update('businessName', e.target.value)}
            className="input"
            placeholder="e.g. Volta Repairs"
          />
        </Field>
        <Field label="Tagline (optional)">
          <input
            value={form.tagline}
            onChange={(e) => update('tagline', e.target.value)}
            className="input"
            placeholder="Scan · Pay · Done"
          />
        </Field>
        <Field label="Lipa Number Label">
          <input
            value={form.lipaLabel}
            onChange={(e) => update('lipaLabel', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Lipa Number">
          <input
            required
            value={form.lipaNumber}
            onChange={(e) => update('lipaNumber', e.target.value)}
            className="input font-display font-bold tracking-wide"
            placeholder="e.g. 522533"
          />
        </Field>
        <Field label="Repair Number (optional)">
          <input
            value={form.repairNumber}
            onChange={(e) => update('repairNumber', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Agent Code (optional)">
          <input
            value={form.agentCode}
            onChange={(e) => update('agentCode', e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Accent Color">
          <input
            type="color"
            value={form.accentColor}
            onChange={(e) => update('accentColor', e.target.value)}
            className="h-11 w-full rounded-lg bg-black/40 border border-white/10"
          />
        </Field>

        <div className="flex gap-3 mt-2">
          <button
            disabled={saving}
            className="flex-1 rounded-lg bg-[#f5c518] text-black font-display font-bold py-3 disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Poster'}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg border border-red-500/40 text-red-400 font-display font-bold px-4 disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>

      <div>
        <div className="text-xs uppercase tracking-widest text-white/40 mb-3">Live Preview</div>
        <PosterPreview
          data={{
            businessName: form.businessName || 'Your Business',
            tagline: form.tagline,
            lipaNumber: form.lipaNumber || '000000',
            lipaLabel: form.lipaLabel,
            repairNumber: form.repairNumber,
            agentCode: form.agentCode,
            accentColor: form.accentColor,
          }}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-widest text-white/40">{label}</span>
      {children}
    </label>
  );
}
