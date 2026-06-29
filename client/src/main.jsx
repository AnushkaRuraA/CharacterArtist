import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/context/AuthContext';
import { AppRouter } from '@/router/AppRouter';
import '@/styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111111',
                color: '#F0EDE6',
                border: '1px solid #1E1E1E',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
              },
              success: { iconTheme: { primary: '#FF6B1A', secondary: '#0A0A0A' } },
              error: { iconTheme: { primary: '#C1121F', secondary: '#F0EDE6' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
