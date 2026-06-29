import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from '@/components/ui/Loader';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout } from '@/features/admin/AdminLayout';

const HomePage = lazy(() => import('@/pages/public/HomePage').then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('@/pages/admin/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const HeroAdminPage = lazy(() => import('@/pages/admin/HeroAdminPage').then((m) => ({ default: m.HeroAdminPage })));
const AboutAdminPage = lazy(() => import('@/pages/admin/AboutAdminPage').then((m) => ({ default: m.AboutAdminPage })));
const PortfolioAdminPage = lazy(() => import('@/pages/admin/PortfolioAdminPage').then((m) => ({ default: m.PortfolioAdminPage })));
const SkillsAdminPage = lazy(() => import('@/pages/admin/SkillsAdminPage').then((m) => ({ default: m.SkillsAdminPage })));
const ServicesAdminPage = lazy(() => import('@/pages/admin/ServicesAdminPage').then((m) => ({ default: m.ServicesAdminPage })));
const TestimonialsAdminPage = lazy(() => import('@/pages/admin/TestimonialsAdminPage').then((m) => ({ default: m.TestimonialsAdminPage })));
const MessagesPage = lazy(() => import('@/pages/admin/MessagesPage').then((m) => ({ default: m.MessagesPage })));
const SettingsAdminPage = lazy(() => import('@/pages/admin/SettingsAdminPage').then((m) => ({ default: m.SettingsAdminPage })));
const ProcessAdminPage  = lazy(() => import('@/pages/admin/ProcessAdminPage').then((m) => ({ default: m.ProcessAdminPage })));

const AdminRoute = ({ children }) => (
  <ProtectedRoute>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

export const AppRouter = () => (
  <Suspense fallback={<Loader fullPage />}>
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />

      {/* Admin auth */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin protected */}
      <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
      <Route path="/admin/hero" element={<AdminRoute><HeroAdminPage /></AdminRoute>} />
      <Route path="/admin/about" element={<AdminRoute><AboutAdminPage /></AdminRoute>} />
      <Route path="/admin/portfolio" element={<AdminRoute><PortfolioAdminPage /></AdminRoute>} />
      <Route path="/admin/skills" element={<AdminRoute><SkillsAdminPage /></AdminRoute>} />
      <Route path="/admin/services" element={<AdminRoute><ServicesAdminPage /></AdminRoute>} />
      <Route path="/admin/testimonials" element={<AdminRoute><TestimonialsAdminPage /></AdminRoute>} />
      <Route path="/admin/process" element={<AdminRoute><ProcessAdminPage /></AdminRoute>} />
      <Route path="/admin/messages" element={<AdminRoute><MessagesPage /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><SettingsAdminPage /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);
