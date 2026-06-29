import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

export const HeroAdminPage = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState({ artistName: '', subtitle: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { data } = useQuery({
    queryKey: ['hero'],
    queryFn: () => api.get('/hero').then((r) => r.data.data),
  });

  useEffect(() => {
    if (data) setForm({ artistName: data.artistName || '', subtitle: data.subtitle || '' });
  }, [data]);

  const mutation = useMutation({
    mutationFn: (formData) => api.put('/hero', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      toast.success('Hero updated');
      qc.invalidateQueries({ queryKey: ['hero'] });
    },
    onError: () => toast.error('Update failed'),
  });

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('artistName', form.artistName);
    fd.append('subtitle', form.subtitle);
    if (file) fd.append('image', file);
    mutation.mutate(fd);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-black text-3xl text-off-white mb-8">Hero Section</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="section-label text-off-white/40 mb-2 block">Artist Name</label>
          <input
            value={form.artistName}
            onChange={(e) => setForm({ ...form, artistName: e.target.value })}
            className="w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-4 py-3 font-body text-off-white text-sm"
          />
        </div>

        <div>
          <label className="section-label text-off-white/40 mb-2 block">Subtitle / Tagline</label>
          <input
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-4 py-3 font-body text-off-white text-sm"
          />
        </div>

        <div>
          <label className="section-label text-off-white/40 mb-2 block">Background Image</label>
          <input type="file" accept="image/*" onChange={handleFile} className="font-body text-off-white/50 text-sm" />
          {(preview || data?.backgroundImage?.url) && (
            <img src={preview || data.backgroundImage.url} alt="Hero bg" className="mt-4 h-48 w-full object-cover border border-dark-border" />
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3 bg-amber text-black section-label hover:bg-amber/90 disabled:opacity-50 transition-all"
        >
          {mutation.isPending ? 'Saving...' : 'Save Hero'}
        </button>
      </form>
    </div>
  );
};
