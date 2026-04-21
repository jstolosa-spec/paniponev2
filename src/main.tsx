import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { RootLayout } from '@/components/layout/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { DirectoryPage } from '@/pages/DirectoryPage';
import { OfficialsPage } from '@/pages/OfficialsPage';
import { EmergencyPage } from '@/pages/EmergencyPage';
import { LoginPage } from '@/pages/Admin/LoginPage';
import { AdminDashboard } from '@/pages/Admin/AdminDashboard';
import { AppointmentsPage } from '@/pages/AppointmentsPage';
import ContactPage from '@/pages/ContactPage';
import RegisterPage from '@/pages/RegisterPage';
import ArchivesPage from '@/pages/ArchivesPage';
// Optimized QueryClient for Static Hosting
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache for static-ish data
    },
  },
});
// Production-ready Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "directory", element: <DirectoryPage /> },
      { path: "appointments", element: <AppointmentsPage /> },
      { path: "officials", element: <OfficialsPage /> },
      { path: "emergency", element: <EmergencyPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "archives", element: <ArchivesPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "admin", element: <AdminDashboard /> },
    ]
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);