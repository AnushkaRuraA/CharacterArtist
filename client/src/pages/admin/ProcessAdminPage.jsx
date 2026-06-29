import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

const empty = { title: '', desc: '' };

export const ProcessAdminPage = () => {
  const qc = useQueryClient();
  const [form, setForm]   = useState(empty);
  const [editId, setEditId] = useState(null);

  const { data } = useQuery({
    queryKey: ['process'],
    queryFn: () => api.get('/process').then(r => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (d) => editId ? api.put(`/process/${editId}`, d) : api.post('/process', d),
    onSuccess: () => {
      toast.success(editId ? 'Step updated' : 'Step added');
      qc.invalidateQueries({ queryKey: ['process'] });
      setForm(empty);
      setEditId(null);
    },
    onError: () => toast.error('Save failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/process/${id}`),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['process'] }); },
    onError: () => toast.error('Delete failed'),
  });

  const moveStep = async (steps, fromIdx, toIdx) => {
    const reordered = [...steps];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const items = reordered.map((s, i) => ({ id: s._id, order: i }));
    await api.patch('/process/reorder', { items });
    qc.invalidateQueries({ queryKey: ['process'] });
  };

  const startEdit = (step) => {
    setForm({ title: step.title, desc: step.desc });
    setEditId(step._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputCls = 'w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-3 py-2.5 font-body text-off-white text-sm';

  const steps = data || [];

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-black text-3xl text-off-white mb-2">Process Steps</h1>
      <p className="font-body text-off-white/30 text-sm mb-8">
        The "How the Magic Happens" workflow steps shown on the public site. Order them with the arrows.
      </p>

      {/* Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }}
        className="bg-dark-surface border border-dark-border p-6 mb-8"
      >
        <h2 className="section-label text-off-white/40 mb-4">{editId ? 'Edit Step' : 'Add Step'}</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className={inputCls}
              placeholder="e.g. Concept Sketching"
              required
            />
          </div>
          <div>
            <label className="section-label text-off-white/30 mb-1.5 block text-[10px]">Description *</label>
            <textarea
              value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })}
              className={inputCls + ' resize-none'}
              rows={4}
              placeholder="What happens in this step..."
              required
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="section-label bg-amber text-black px-5 py-2.5 hover:bg-amber/90 disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Saving...' : editId ? 'Update Step' : 'Add Step'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => { setForm(empty); setEditId(null); }}
              className="section-label border border-dark-border text-off-white/40 px-5 py-2.5 hover:border-amber/50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Steps list */}
      <div className="border border-dark-border overflow-hidden">
        {steps.length === 0 && (
          <p className="text-center py-10 text-off-white/20 font-body text-sm">
            No steps yet. Add your first process step above.
          </p>
        )}
        {steps.map((step, i) => (
          <div key={step._id} className="flex items-start gap-4 px-4 py-4 border-b border-dark-border last:border-b-0">
            {/* step number */}
            <span className="font-display font-black text-amber/30 text-2xl leading-none w-10 flex-shrink-0 mt-0.5">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* content */}
            <div className="flex-1 min-w-0">
              <p className="font-body font-medium text-off-white text-sm">{step.title}</p>
              <p className="font-body text-off-white/30 text-xs mt-1 leading-relaxed line-clamp-2">{step.desc}</p>
            </div>

            {/* controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => moveStep(steps, i, i - 1)}
                disabled={i === 0}
                className="w-7 h-7 flex items-center justify-center text-off-white/30 hover:text-amber disabled:opacity-20 transition-colors text-sm"
                title="Move up"
              >↑</button>
              <button
                onClick={() => moveStep(steps, i, i + 1)}
                disabled={i === steps.length - 1}
                className="w-7 h-7 flex items-center justify-center text-off-white/30 hover:text-amber disabled:opacity-20 transition-colors text-sm"
                title="Move down"
              >↓</button>
              <button
                onClick={() => startEdit(step)}
                className="section-label text-[10px] px-2.5 py-1 border border-dark-border text-off-white/30 hover:text-amber hover:border-amber/50 transition-all ml-1"
              >
                Edit
              </button>
              <button
                onClick={() => { if (window.confirm('Delete this step?')) deleteMutation.mutate(step._id); }}
                className="section-label text-[10px] px-2.5 py-1 border border-dark-border text-off-white/30 hover:text-crimson hover:border-crimson/50 transition-all"
              >
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      {steps.length > 0 && (
        <p className="font-body text-off-white/20 text-xs mt-3">
          {steps.length} step{steps.length !== 1 ? 's' : ''} · Use ↑↓ to reorder
        </p>
      )}
    </div>
  );
};
