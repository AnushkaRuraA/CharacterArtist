import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

export const SettingsAdminPage = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    contactEmail: '', autoReplyBody: '', isAvailableForWork: true,
    seoTitle: '', seoDescription: '', siteTagline: '',
  });

  const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data.data),
  });

  useEffect(() => {
    if (data) {
      setForm({
        contactEmail: data.contactEmail || '',
        autoReplyBody: data.autoReplyBody || '',
        isAvailableForWork: data.isAvailableForWork ?? true,
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        siteTagline: data.siteTagline || '',
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (d) => api.put('/settings', d),
    onSuccess: () => { toast.success('Settings saved'); qc.invalidateQueries({ queryKey: ['settings'] }); },
    onError: () => toast.error('Save failed'),
  });

  const inputCls = 'w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-4 py-3 font-body text-off-white text-sm transition-colors';
  const labelCls = 'section-label text-off-white/40 mb-2 block text-[10px]';

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-black text-3xl text-off-white mb-8">Settings</h1>

      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }} className="flex flex-col gap-8">
        {/* Availability */}
        <div className="bg-dark-surface border border-dark-border p-6">
          <h2 className="section-label text-off-white/60 mb-4">Availability</h2>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`relative w-11 h-6 rounded-full transition-colors ${form.isAvailableForWork ? 'bg-green-600' : 'bg-dark-border'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.isAvailableForWork ? 'left-6' : 'left-1'}`} />
            </div>
            <input type="checkbox" className="sr-only" checked={form.isAvailableForWork} onChange={(e) => setForm({ ...form, isAvailableForWork: e.target.checked })} />
            <span className={`font-body text-sm ${form.isAvailableForWork ? 'text-green-400' : 'text-off-white/40'}`}>
              {form.isAvailableForWork ? 'Available for work' : 'Not available'}
            </span>
          </label>
        </div>

        {/* Contact */}
        <div className="bg-dark-surface border border-dark-border p-6">
          <h2 className="section-label text-off-white/60 mb-4">Contact Email</h2>
          <div>
            <label className={labelCls}>Receiving Email (where inquiries are sent)</label>
            <input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className={inputCls} />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Auto-Reply Message Body</label>
            <textarea value={form.autoReplyBody} onChange={(e) => setForm({ ...form, autoReplyBody: e.target.value })} rows={4} className={`${inputCls} resize-y`} />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-dark-surface border border-dark-border p-6">
          <h2 className="section-label text-off-white/60 mb-4">SEO & Meta</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelCls}>Site Title (used as artist name)</label>
              <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className={inputCls} placeholder="John Doe — Character Artist" />
            </div>
            <div>
              <label className={labelCls}>Site Tagline</label>
              <input value={form.siteTagline} onChange={(e) => setForm({ ...form, siteTagline: e.target.value })} className={inputCls} placeholder="Character Artist · Concept · 3D Sculpt" />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={mutation.isPending} className="py-3 bg-amber text-black section-label hover:bg-amber/90 disabled:opacity-50 transition-all">
          {mutation.isPending ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
};
