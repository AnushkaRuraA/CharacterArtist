import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

const emptyForm = { quote: '', clientName: '', company: '', rating: 5 };

export const TestimonialsAdminPage = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);

  const { data } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials').then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (fd) => editId
      ? api.put(`/testimonials/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.post('/testimonials', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      toast.success(editId ? 'Updated' : 'Created');
      qc.invalidateQueries({ queryKey: ['testimonials'] });
      setForm(emptyForm); setEditId(null); setFile(null);
    },
    onError: () => toast.error('Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/testimonials/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['testimonials'] }); },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (file) fd.append('image', file);
    saveMutation.mutate(fd);
  };

  const inputCls = 'w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-3 py-2.5 font-body text-off-white text-sm';

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-black text-3xl text-off-white mb-8">Testimonials</h1>

      <form onSubmit={handleSubmit} className="bg-dark-surface border border-dark-border p-6 mb-8">
        <h2 className="section-label text-off-white/40 mb-4">{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Quote *</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} className={`${inputCls} resize-none`} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Client Name *</label>
              <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className={inputCls} required />
            </div>
            <div>
              <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Company</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Rating: {form.rating}/5</label>
            <input type="range" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="accent-amber w-full" />
          </div>
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Avatar Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="font-body text-off-white/50 text-xs" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button type="submit" disabled={saveMutation.isPending} className="section-label bg-amber text-black px-5 py-2.5 disabled:opacity-50">
            {saveMutation.isPending ? 'Saving...' : editId ? 'Update' : 'Add'}
          </button>
          {editId && <button type="button" onClick={() => { setForm(emptyForm); setEditId(null); }} className="section-label border border-dark-border text-off-white/40 px-5 py-2.5">Cancel</button>}
        </div>
      </form>

      <div className="border border-dark-border overflow-hidden">
        {(data || []).map((t) => (
          <div key={t._id} className="flex gap-4 px-4 py-4 border-b border-dark-border">
            {t.avatar?.url ? (
              <img src={t.avatar.url} alt={t.clientName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-dark-border flex-shrink-0 flex items-center justify-center text-off-white/30 text-xs">{t.clientName?.[0]}</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-body font-medium text-off-white text-sm">{t.clientName} {t.company && <span className="text-off-white/30 font-normal">— {t.company}</span>}</p>
              <p className="font-body text-off-white/40 text-xs mt-1 line-clamp-2">"{t.quote}"</p>
              <div className="flex mt-1">{Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-amber text-xs">★</span>)}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => { setForm({ quote: t.quote, clientName: t.clientName, company: t.company || '', rating: t.rating }); setEditId(t._id); }} className="text-xs text-off-white/30 hover:text-amber">Edit</button>
              <button onClick={() => { if (window.confirm('Delete?')) deleteMutation.mutate(t._id); }} className="text-xs text-off-white/30 hover:text-crimson">Del</button>
            </div>
          </div>
        ))}
        {!data?.length && <p className="text-center py-10 text-off-white/20 font-body text-sm">No testimonials yet.</p>}
      </div>
    </div>
  );
};
