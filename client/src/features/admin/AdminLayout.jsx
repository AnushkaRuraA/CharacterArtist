import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '◈', exact: true },
  { to: '/admin/hero', label: 'Hero', icon: '⬡' },
  { to: '/admin/about', label: 'About', icon: '◻' },
  { to: '/admin/portfolio', label: 'Portfolio', icon: '◩' },
  { to: '/admin/skills', label: 'Skills', icon: '◉' },
  { to: '/admin/services', label: 'Services', icon: '◆' },
  { to: '/admin/process',      label: 'Process',      icon: '◌' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '◇' },
  { to: '/admin/messages', label: 'Messages', icon: '◎' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-black text-off-white font-body">
      {/* Sidebar */}
      <aside className={cn(
        'flex flex-col border-r border-dark-border transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-border">
          {!collapsed && (
            <span className="font-display font-black text-amber text-sm tracking-widest uppercase">Admin</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-off-white/30 hover:text-amber transition-colors text-xs"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 text-xs transition-all duration-200',
                  isActive
                    ? 'text-amber bg-amber/5 border-r-2 border-amber'
                    : 'text-off-white/40 hover:text-off-white/70 hover:bg-dark-surface'
                )
              }
            >
              <span className="text-base">{item.icon}</span>
              {!collapsed && <span className="tracking-wider uppercase">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-dark-border p-4">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 text-xs text-off-white/30 hover:text-crimson transition-colors w-full',
              collapsed && 'justify-center'
            )}
          >
            <span>⎋</span>
            {!collapsed && <span className="tracking-wider uppercase">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
