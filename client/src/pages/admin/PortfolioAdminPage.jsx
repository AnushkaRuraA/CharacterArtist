import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { cn } from '@/utils/cn';

const CATEGORIES = ['characters', 'creatures', 'environments', 'concepts', 'fanart', 'game-ready'];

const emptyForm = {
  title: '', category: 'characters', description: '', tags: '', software: '',
  year: new Date().getFullYear(), polyCount: '', engine: '', modelEmbedUrl: '',
  isFeatured: false, isPublished: true,
};

const PortfolioForm = ({ item, onClose, onSaved }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState(item ? {
    ...item,
    tags: (item.tags || []).join(', '),
    software: (item.software || []).join(', '),
  } : { ...emptyForm });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const mutation = useMutation({
    mutationFn: (fd) => item
      ? api.put(`/portfolio/${item._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.post('/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      toast.success(item ? 'Artwork updated' : 'Artwork created');
      qc.invalidateQueries({ queryKey: ['admin-portfolio'] });
      onSaved?.();
      onClose();
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const handleFiles = (e) => {
    const fs = Array.from(e.target.files);
    setFiles(fs);
    setPreviews(fs.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    files.forEach((f) => fd.append('images', f));
    mutation.mutate(fd);
  };

  const inputCls = 'w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-3 py-2.5 font-body text-off-white text-sm';
  const labelCls = 'section-label text-off-white/40 mb-1.5 block text-[10px]';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-dark-surface border border-dark-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border sticky top-0 bg-dark-surface">
          <h2 className="font-display font-bold text-off-white text-lg">{item ? 'Edit Artwork' : 'Add Artwork'}</h2>
          <button onClick={onClose} className="text-off-white/40 hover:text-amber text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${inputCls} bg-dark-surface`}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputCls} resize-y`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} placeholder="hero, fantasy..." />
            </div>
            <div>
              <label className={labelCls}>Software (comma-separated)</label>
              <input value={form.software} onChange={(e) => setForm({ ...form, software: e.target.value })} className={inputCls} placeholder="ZBrush, Blender..." />
            </div>
            <div>
              <label className={labelCls}>Engine</label>
              <input value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })} className={inputCls} placeholder="Unreal 5..." />
            </div>
            <div>
              <label className={labelCls}>Poly Count</label>
              <input value={form.polyCount} onChange={(e) => setForm({ ...form, polyCount: e.target.value })} className={inputCls} placeholder="50k tris" />
            </div>
          </div>

          <div>
            <label className={labelCls}>3D Model Embed URL (Sketchfab)</label>
            <input value={form.modelEmbedUrl} onChange={(e) => setForm({ ...form, modelEmbedUrl: e.target.value })} className={inputCls} />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 font-body text-off-white/60 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-amber" />
              Featured
            </label>
            <label className="flex items-center gap-2 font-body text-off-white/60 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="accent-amber" />
              Published
            </label>
          </div>

          <div>
            <label className={labelCls}>Images (up to 10)</label>
            <input type="file" accept="image/*" multiple onChange={handleFiles} className="font-body text-off-white/50 text-xs" />
            {(previews.length > 0 || item?.images?.length > 0) && (
              <div className="flex gap-2 flex-wrap mt-3">
                {(previews.length > 0 ? previews : item.images.map((i) => i.url)).map((src, idx) => (
                  <img key={idx} src={src} alt="" className="h-16 w-16 object-cover border border-dark-border" />
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={mutation.isPending} className="py-3 bg-amber text-black section-label hover:bg-amber/90 disabled:opacity-50">
            {mutation.isPending ? 'Saving...' : item ? 'Update Artwork' : 'Create Artwork'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const PortfolioAdminPage = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: () => api.get('/portfolio/admin/all').then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/portfolio/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin-portfolio'] }); },
    onError: () => toast.error('Delete failed'),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, isFeatured }) => {
      const fd = new FormData();
      fd.append('isFeatured', String(!isFeatured));
      return api.put(`/portfolio/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-portfolio'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-off-white">Portfolio</h1>
          <p className="font-body text-off-white/30 text-sm mt-1">{data?.length || 0} artworks</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowForm(true); }} className="section-label border border-amber text-amber px-5 py-2.5 hover:bg-amber hover:text-black transition-all duration-300">
          + Add Artwork
        </button>
      </div>

      {isLoading && <p className="font-body text-off-white/30 text-sm">Loading...</p>}

      <div className="border border-dark-border overflow-hidden">
        {(data || []).map((item) => {
          const img = item.images?.find((i) => i.isPrimary) || item.images?.[0];
          return (
            <div key={item._id} className="flex items-center gap-4 px-4 py-3 border-b border-dark-border hover:bg-dark-surface/50 transition-colors">
              {img?.url ? (
                <img src={img.url} alt={item.title} className="w-12 h-12 object-cover flex-shrink-0 border border-dark-border" />
              ) : (
                <div className="w-12 h-12 bg-dark-border flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-off-white text-sm truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="section-label text-off-white/25 text-[10px]">{item.category}</span>
                  {item.isFeatured && <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block" title="Featured" />}
                  {!item.isPublished && <span className="section-label text-crimson text-[10px]">DRAFT</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleFeatured.mutate({ id: item._id, isFeatured: item.isFeatured })}
                  className={cn('text-xs px-2 py-1 border transition-colors', item.isFeatured ? 'border-amber text-amber' : 'border-dark-border text-off-white/30 hover:border-amber/50')}
                  title="Toggle Featured"
                >
                  ★
                </button>
                <button
                  onClick={() => { setEditItem(item); setShowForm(true); }}
                  className="section-label text-off-white/30 hover:text-amber transition-colors text-xs px-2 py-1 border border-dark-border hover:border-amber/50"
                >
                  Edit
                </button>
                <button
                  onClick={() => { if (window.confirm('Delete this artwork?')) deleteMutation.mutate(item._id); }}
                  className="section-label text-off-white/30 hover:text-crimson transition-colors text-xs px-2 py-1 border border-dark-border hover:border-crimson/50"
                >
                  Del
                </button>
              </div>
            </div>
          );
        })}
        {!isLoading && !data?.length && (
          <div className="py-16 text-center text-off-white/20 font-body text-sm">
            No artworks yet. Add your first piece!
          </div>
        )}
      </div>

      {showForm && (
        <PortfolioForm
          item={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSaved={() => qc.invalidateQueries({ queryKey: ['admin-portfolio'] })}
        />
      )}
    </div>
  );
};
