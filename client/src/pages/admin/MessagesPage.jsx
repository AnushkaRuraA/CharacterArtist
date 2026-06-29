import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import api from '@/services/api';
import { formatDate } from '@/utils/formatDate';

export const MessagesPage = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState({ read: '', type: '' });
  const [selected, setSelected] = useState(null);

  const { data } = useQuery({
    queryKey: ['messages', filter],
    queryFn: () => api.get('/contact/messages', { params: filter }).then((r) => r.data.data),
  });

  const markRead = useMutation({
    mutationFn: (id) => api.patch(`/contact/messages/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/contact/messages/${id}`),
    onSuccess: () => {
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['messages'] });
      setSelected(null);
    },
  });

  const handleSelect = (msg) => {
    setSelected(msg);
    if (!msg.isRead) markRead.mutate(msg._id);
  };

  const filters = [
    { label: 'All', read: '', type: '' },
    { label: 'Unread', read: 'false', type: '' },
    { label: 'Quick', read: '', type: 'quick' },
    { label: 'Projects', read: '', type: 'project' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="font-display font-black text-3xl text-off-white">Messages</h1>
        <p className="font-body text-off-white/30 text-sm mt-1">{data?.length || 0} messages</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter({ read: f.read, type: f.type })}
            className={cn(
              'section-label px-3 py-1.5 border text-[10px] transition-all',
              filter.read === f.read && filter.type === f.type
                ? 'border-amber text-amber bg-amber/5'
                : 'border-dark-border text-off-white/30 hover:border-amber/40'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* List */}
        <div className="w-80 flex-shrink-0 border border-dark-border overflow-y-auto">
          {(data || []).map((msg) => (
            <button
              key={msg._id}
              onClick={() => handleSelect(msg)}
              className={cn(
                'w-full text-left px-4 py-4 border-b border-dark-border transition-colors',
                selected?._id === msg._id ? 'bg-amber/5 border-l-2 border-l-amber' : 'hover:bg-dark-surface',
                !msg.isRead && 'border-l-2 border-l-amber/40'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={cn('font-body text-sm truncate', msg.isRead ? 'text-off-white/70' : 'text-off-white font-medium')}>
                  {msg.name}
                </p>
                <span className="section-label text-off-white/20 text-[9px] flex-shrink-0">{msg.type}</span>
              </div>
              <p className="font-body text-off-white/30 text-xs truncate mt-0.5">{msg.email}</p>
              <p className="font-body text-off-white/20 text-xs mt-1 line-clamp-1">{msg.message}</p>
              <p className="font-body text-off-white/20 text-xs mt-1">{formatDate(msg.createdAt)}</p>
            </button>
          ))}
          {!data?.length && <p className="text-center py-10 text-off-white/20 font-body text-sm">No messages</p>}
        </div>

        {/* Detail */}
        <div className="flex-1 border border-dark-border overflow-y-auto p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-off-white text-xl">{selected.name}</h2>
                  <p className="font-body text-off-white/40 text-sm">{selected.email}</p>
                  <p className="font-body text-off-white/20 text-xs mt-1">{formatDate(selected.createdAt)} · {selected.type}</p>
                </div>
                <button
                  onClick={() => { if (window.confirm('Delete this message?')) deleteMutation.mutate(selected._id); }}
                  className="section-label text-crimson border border-crimson/30 px-3 py-1.5 text-[10px] hover:bg-crimson/10"
                >
                  Delete
                </button>
              </div>

              {selected.subject && (
                <div className="mb-4">
                  <p className="section-label text-off-white/30 mb-1">Subject</p>
                  <p className="font-body text-off-white/70 text-sm">{selected.subject}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="section-label text-off-white/30 mb-2">Message</p>
                <p className="font-body text-off-white/70 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {selected.type === 'project' && (
                <div className="border-t border-dark-border pt-4 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Project Type', value: selected.projectType },
                    { label: 'Budget', value: selected.budget },
                    { label: 'Deadline', value: selected.deadline },
                    { label: 'References', value: selected.referenceLinks },
                  ].filter((i) => i.value).map((item) => (
                    <div key={item.label}>
                      <p className="section-label text-off-white/30 mb-1">{item.label}</p>
                      <p className="font-body text-off-white/70 text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <a
                href={`mailto:${selected.email}`}
                className="mt-6 inline-flex items-center gap-2 section-label border border-amber text-amber px-5 py-2.5 hover:bg-amber hover:text-black transition-all duration-300"
              >
                Reply via Email →
              </a>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="font-body text-off-white/20 text-sm">Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
