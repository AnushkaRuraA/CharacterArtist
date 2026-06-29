import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { cn } from '@/utils/cn';

const emptyForm = { name: '', description: '', priceLabel: '', icon: '', isVisible: true };

export const ServicesAdminPage = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const { data } = useQuery({
    queryKey: ['services-admin'],
    queryFn: () => api.get('/services/admin').then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (d) => editId ? api.put(`/services/${editId}`, d) : api.post('/services', d),
    onSuccess: () => {
      toast.success(editId ? 'Updated' : 'Created');
      qc.invalidateQueries({ queryKey: ['services-admin'] });
      qc.invalidateQueries({ queryKey: ['services'] });
      setForm(emptyForm); setEditId(null);
    },
    onError: () => toast.error('Save failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['services-admin'] }); },
  });

  const toggleVisible = useMutation({
    mutationFn: ({ id, isVisible }) => api.put(`/services/${id}`, { isVisible: !isVisible }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services-admin'] }),
  });

  const inputCls = 'w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-3 py-2.5 font-body text-off-white text-sm';

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-black text-3xl text-off-white mb-8">Services</h1>

      <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="bg-dark-surface border border-dark-border p-6 mb-8">
        <h2 className="section-label text-off-white/40 mb-4">{editId ? 'Edit Service' : 'Add Service'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} required />
          </div>
          <div className="col-span-2">
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Price Label</label>
            <input value={form.priceLabel} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })} className={inputCls} placeholder="From $200" />
          </div>
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Icon (emoji)</label>
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputCls} placeholder="🎨" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button type="submit" disabled={saveMutation.isPending} className="section-label bg-amber text-black px-5 py-2.5 hover:bg-amber/90 disabled:opacity-50">
            {saveMutation.isPending ? 'Saving...' : editId ? 'Update' : 'Add'}
          </button>
          {editId && <button type="button" onClick={() => { setForm(emptyForm); setEditId(null); }} className="section-label border border-dark-border text-off-white/40 px-5 py-2.5">Cancel</button>}
        </div>
      </form>

      <div className="border border-dark-border overflow-hidden">
        {(data || []).map((svc) => (
          <div key={svc._id} className={cn('flex items-start gap-4 px-4 py-4 border-b border-dark-border', !svc.isVisible && 'opacity-40')}>
            <span className="text-xl">{svc.icon || '◈'}</span>
            <div className="flex-1">
              <p className="font-body font-medium text-off-white text-sm">{svc.name}</p>
              <p className="font-body text-off-white/40 text-xs mt-1 line-clamp-2">{svc.description}</p>
              {svc.priceLabel && <p className="text-amber text-xs mt-1 font-body">{svc.priceLabel}</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => toggleVisible.mutate({ id: svc._id, isVisible: svc.isVisible })}
                className={cn('text-xs px-2 py-1 border transition-colors', svc.isVisible ? 'border-green-700 text-green-400' : 'border-dark-border text-off-white/30')}>
                {svc.isVisible ? 'Visible' : 'Hidden'}
              </button>
              <button onClick={() => { setForm({ name: svc.name, description: svc.description, priceLabel: svc.priceLabel || '', icon: svc.icon || '', isVisible: svc.isVisible }); setEditId(svc._id); }}
                className="text-xs text-off-white/30 hover:text-amber">Edit</button>
              <button onClick={() => { if (window.confirm('Delete?')) deleteMutation.mutate(svc._id); }}
                className="text-xs text-off-white/30 hover:text-crimson">Del</button>
            </div>
          </div>
        ))}
        {!data?.length && <p className="text-center py-10 text-off-white/20 font-body text-sm">No services yet.</p>}
      </div>
    </div>
  );
};
