import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CatalogoTramitesPage from './pages/CatalogoTramitesPage';
import SolicitudTramitePage from './pages/SolicitudTramitePage';
import SeguimientoPage from './pages/SeguimientoPage';
import NotificacionesPage from './pages/NotificacionesPage';

// Simple role guard — does NOT render a layout, just checks roles
const RoleGuard = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/MVP_GLD">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/seguimiento" element={<SeguimientoPage />} />
            <Route path="/notificaciones" element={<NotificacionesPage />} />
            
            {/* Rutas exclusivas para Ciudadano */}
            <Route element={<RoleGuard allowedRoles={['CIUDADANO']} />}>
              <Route path="/tramites" element={<CatalogoTramitesPage />} />
              <Route path="/tramites/solicitar/:id" element={<SolicitudTramitePage />} />
              <Route path="/mis-solicitudes" element={<DashboardPage />} /> {/* Placeholder to prevent 404 */}
            </Route>

            {/* Rutas exclusivas para Funcionario */}
            <Route element={<RoleGuard allowedRoles={['FUNCIONARIO', 'ADMIN']} />}>
              <Route path="/bandeja" element={<div className="p-6">Bandeja de Funcionario (En construcción)</div>} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
