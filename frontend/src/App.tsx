/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Main Application Component
   Providers: TanStack React Query, ThemeProvider, LanguageProvider,
              AuthProvider, ToastProvider.
   Routing: React Router v6 with 20 domain modules, AppLayout,
            RBAC guards for admin, Settings, Login, 403, and 404.
   ────────────────────────────────────────────────────────────────── */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { LanguageProvider } from '@/hooks/useLanguage';
import { usePermissions } from '@/hooks/usePermissions';
import { ToastProvider } from '@/components/ui';
import { AppLayout } from '@/app/AppLayout';

import {
  DashboardPage,
  LiveMapPage,
  TopologyPage,
  OutagesPage,
  FaultLocatorPage,
  MaintenancePage,
  AllAssetsPage,
  SubstationsPage,
  TransformersPage,
  FeedersPage,
  JunctionsPage,
  MetersPage,
  IoTSensorsPage,
  AiAnalysisPage,
  AnalyticsPage,
  ReportsPage,
  SimulationLabPage,
  NotificationsPage,
  UserManagementPage,
  SettingsPage,
  LoginPage,
  ForbiddenPage,
  NotFoundPage,
} from '@/pages';

// Create a stable TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30s
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/** Seed default demo user in localStorage if none exists */
if (!localStorage.getItem('mahagrid_user')) {
  localStorage.setItem(
    'mahagrid_user',
    JSON.stringify({
      id: 'usr-demo-admin',
      email: 'admin@mahagrid.gov.in',
      name: 'Yashraj Jadhav',
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
    }),
  );
}

/** Route guard for Admin-only modules */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = usePermissions();
  if (!isAdmin) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  {/* Standalone Auth & Error Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/403" element={<ForbiddenPage />} />
                  <Route path="/404" element={<NotFoundPage />} />

                  {/* Main Application Layout with persistent navigation */}
                  <Route path="/" element={<AppLayout />}>
                    {/* Index redirects to /dashboard */}
                    <Route index element={<Navigate to="/dashboard" replace />} />

                    {/* 20 Planned Modules */}
                    {/* Overview */}
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="map" element={<LiveMapPage />} />
                    <Route path="topology" element={<TopologyPage />} />

                    {/* Operations */}
                    <Route path="outages" element={<OutagesPage />} />
                    <Route path="fault-locator" element={<FaultLocatorPage />} />
                    <Route path="maintenance" element={<MaintenancePage />} />

                    {/* Assets */}
                    <Route path="assets" element={<AllAssetsPage />} />
                    <Route path="substations" element={<SubstationsPage />} />
                    <Route path="transformers" element={<TransformersPage />} />
                    <Route path="feeders" element={<FeedersPage />} />
                    <Route path="junctions" element={<JunctionsPage />} />
                    <Route path="meters" element={<MetersPage />} />
                    <Route path="devices" element={<IoTSensorsPage />} />

                    {/* Intelligence */}
                    <Route path="ai-analysis" element={<AiAnalysisPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="simulation" element={<SimulationLabPage />} />

                    {/* System */}
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route
                      path="users"
                      element={
                        <AdminRoute>
                          <UserManagementPage />
                        </AdminRoute>
                      }
                    />
                    {/* Settings is accessible to all authenticated roles with role-adapted tabs */}
                    <Route path="settings" element={<SettingsPage />} />

                    {/* Catch-all inside layout */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
