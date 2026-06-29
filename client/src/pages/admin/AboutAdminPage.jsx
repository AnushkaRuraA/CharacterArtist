import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

export const AboutAdminPage = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState({ bio: '', skillTags: '', yearsExperience: 0, projectsCompleted: 0, clientsServed: 0 });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { data } = useQuery({
    queryKey: ['about'],
    queryFn: () => api.get('/about').then((r) => r.data.data),
  });

  useEffect(() => {
    if (data) {
      setForm({
        bio: data.bio || '',
        skillTags: (data.skillTags || []).join(', '),
        yearsExperience: data.yearsExperience || 0,
        projectsCompleted: data.projectsCompleted || 0,
        clientsServed: data.clientsServed || 0,
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (fd) => api.put('/about', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => { toast.success('About updated'); qc.invalidateQueries({ queryKey: ['about'] }); },
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
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    mutation.mutate(fd);
  };

  const inputCls = 'w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-4 py-3 font-body text-off-white text-sm';
  const labelCls = 'section-label text-off-white/40 mb-2 block';

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-black text-3xl text-off-white mb-8">About Section</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className={labelCls}>Bio (HTML allowed)</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={6}
            className={`${inputCls} resize-y`}
          />
        </div>

        <div>
          <label className={labelCls}>Skill Tags (comma-separated)</label>
          <input value={form.skillTags} onChange={(e) => setForm({ ...form, skillTags: e.target.value })} className={inputCls} placeholder="ZBrush, Substance, Unreal..." />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'yearsExperience', label: 'Years' },
            { key: 'projectsCompleted', label: 'Projects' },
            { key: 'clientsServed', label: 'Clients' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input type="number" value={form[key]} onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })} className={inputCls} min="0" />
            </div>
          ))}
        </div>

        <div>
          <label className={labelCls}>Portrait Image</label>
          <input type="file" accept="image/*" onChange={handleFile} className="font-body text-off-white/50 text-sm" />
          {(preview || data?.portrait?.url) && (
            <img src={preview || data.portrait.url} alt="Portrait" className="mt-4 h-48 w-32 object-cover border border-dark-border" />
          )}
        </div>

        <button type="submit" disabled={mutation.isPending} className="py-3 bg-amber text-black section-label hover:bg-amber/90 disabled:opacity-50">
          {mutation.isPending ? 'Saving...' : 'Save About'}
        </button>
      </form>
    </div>
  );
};
