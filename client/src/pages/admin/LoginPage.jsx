import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { login } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      setUser(res.data.data.user);
      toast.success('Welcome back.');
      navigate('/admin');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    },
  });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="font-display font-black text-4xl text-off-white mb-2">Admin</h1>
          <p className="font-body text-off-white/30 text-sm tracking-wider uppercase">Portfolio Control Panel</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }}
          className="flex flex-col gap-6"
        >
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-4 py-3 font-body text-off-white text-sm transition-colors"
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-dark-surface border border-dark-border focus:border-amber outline-none px-4 py-3 font-body text-off-white text-sm transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-4 bg-amber text-black section-label hover:bg-amber/90 disabled:opacity-50 transition-all duration-300"
          >
            {mutation.isPending ? 'Signing in...' : 'Enter'}
          </button>
        </form>

        <p className="text-center mt-8 font-body text-off-white/20 text-xs">
          Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};
