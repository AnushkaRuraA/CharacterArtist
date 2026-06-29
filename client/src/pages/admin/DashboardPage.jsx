import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const StatCard = ({ label, value, sub }) => (
  <div className="bg-dark-surface border border-dark-border p-6">
    <p className="section-label text-off-white/30 mb-3">{label}</p>
    <p className="font-display font-black text-4xl text-off-white">{value ?? '—'}</p>
    {sub && <p className="font-body text-off-white/30 text-xs mt-2">{sub}</p>}
  </div>
);

export const DashboardPage = () => {
  const { data: portfolio } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: () => api.get('/portfolio/admin/all').then((r) => r.data.data),
  });

  const { data: messages } = useQuery({
    queryKey: ['messages'],
    queryFn: () => api.get('/contact/messages').then((r) => r.data.data),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data.data),
  });

  const total = portfolio?.length || 0;
  const featured = portfolio?.filter((p) => p.isFeatured).length || 0;
  const published = portfolio?.filter((p) => p.isPublished).length || 0;
  const unread = messages?.filter((m) => !m.isRead).length || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-off-white">Dashboard</h1>
        <p className="font-body text-off-white/30 text-sm mt-1">Portfolio overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Works" value={total} sub={`${published} published`} />
        <StatCard label="Featured" value={featured} />
        <StatCard label="Messages" value={messages?.length || 0} sub={unread ? `${unread} unread` : 'All read'} />
        <StatCard
          label="Status"
          value={settings?.isAvailableForWork ? '🟢' : '🔴'}
          sub={settings?.isAvailableForWork ? 'Available for work' : 'Unavailable'}
        />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="section-label text-off-white/40 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Add Artwork', href: '/admin/portfolio?new=1' },
            { label: 'View Messages', href: '/admin/messages' },
            { label: 'Edit Hero', href: '/admin/hero' },
            { label: 'Settings', href: '/admin/settings' },
          ].map((a) => (
            <a
              key={a.label}
              href={a.href}
              className="section-label border border-dark-border text-off-white/50 px-4 py-2 hover:border-amber hover:text-amber transition-all duration-200"
            >
              {a.label}
            </a>
          ))}
        </div>
      </div>

      {/* Recent messages */}
      {messages?.length > 0 && (
        <div>
          <h2 className="section-label text-off-white/40 mb-4">Recent Messages</h2>
          <div className="border border-dark-border overflow-hidden">
            {messages.slice(0, 5).map((msg) => (
              <div
                key={msg._id}
                className={`flex items-center justify-between px-5 py-4 border-b border-dark-border last:border-0 ${!msg.isRead ? 'bg-amber/3' : ''}`}
              >
                <div>
                  <span className="font-body font-medium text-off-white text-sm">{msg.name}</span>
                  <span className="font-body text-off-white/30 text-xs ml-3">{msg.email}</span>
                  {!msg.isRead && <span className="ml-2 w-1.5 h-1.5 inline-block rounded-full bg-amber" />}
                </div>
                <div className="text-right">
                  <span className="section-label text-off-white/20">{msg.type}</span>
                  <p className="font-body text-off-white/30 text-xs mt-0.5">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
