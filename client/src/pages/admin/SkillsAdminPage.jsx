import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

const emptyForm = { name: '', icon: '', proficiency: 80, category: 'general' };

export const SkillsAdminPage = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const { data } = useQuery({
    queryKey: ['skills'],
    queryFn: () => api.get('/skills').then((r) => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (d) => editId ? api.put(`/skills/${editId}`, d) : api.post('/skills', d),
    onSuccess: () => {
      toast.success(editId ? 'Updated' : 'Created');
      qc.invalidateQueries({ queryKey: ['skills'] });
      setForm(emptyForm);
      setEditId(null);
    },
    onError: () => toast.error('Save failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/skills/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['skills'] }); },
  });

  const inputCls = 'w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-3 py-2.5 font-body text-off-white text-sm';

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-black text-3xl text-off-white mb-8">Skills</h1>

      {/* Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }}
        className="bg-dark-surface border border-dark-border p-6 mb-8"
      >
        <h2 className="section-label text-off-white/40 mb-4">{editId ? 'Edit Skill' : 'Add Skill'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} required />
          </div>
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Icon (emoji)</label>
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputCls} placeholder="🎨" />
          </div>
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Proficiency (0-100)</label>
            <input type="range" min="0" max="100" value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
              className="w-full accent-amber"
            />
            <p className="text-amber text-xs font-body mt-1">{form.proficiency}%</p>
          </div>
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button type="submit" disabled={saveMutation.isPending} className="section-label bg-amber text-black px-5 py-2.5 hover:bg-amber/90 disabled:opacity-50">
            {saveMutation.isPending ? 'Saving...' : editId ? 'Update' : 'Add Skill'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setForm(emptyForm); setEditId(null); }} className="section-label border border-dark-border text-off-white/40 px-5 py-2.5 hover:border-amber/50">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Skills list */}
      <div className="border border-dark-border overflow-hidden">
        {(data || []).map((skill) => (
          <div key={skill._id} className="flex items-center gap-4 px-4 py-3 border-b border-dark-border">
            <span className="text-2xl w-8">{skill.icon || '◈'}</span>
            <div className="flex-1">
              <p className="font-body font-medium text-off-white text-sm">{skill.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 h-1 bg-dark-border overflow-hidden">
                  <div className="h-full bg-amber" style={{ width: `${skill.proficiency}%` }} />
                </div>
                <span className="text-off-white/30 text-xs font-body">{skill.proficiency}%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setForm({ name: skill.name, icon: skill.icon || '', proficiency: skill.proficiency, category: skill.category || 'general' }); setEditId(skill._id); }}
                className="text-xs text-off-white/30 hover:text-amber transition-colors">Edit</button>
              <button onClick={() => { if (window.confirm('Delete?')) deleteMutation.mutate(skill._id); }}
                className="text-xs text-off-white/30 hover:text-crimson transition-colors">Del</button>
            </div>
          </div>
        ))}
        {!data?.length && <p className="text-center py-10 text-off-white/20 font-body text-sm">No skills yet.</p>}
      </div>
    </div>
  );
};
