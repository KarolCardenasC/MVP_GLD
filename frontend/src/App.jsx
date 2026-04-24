import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CatalogoTramitesPage from './pages/CatalogoTramitesPage';
import SolicitudTramitePage from './pages/SolicitudTramitePage';
import SeguimientoPage from './pages/SeguimientoPage';
import NotificacionesPage from './pages/NotificacionesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/seguimiento" element={<SeguimientoPage />} />
            <Route path="/notificaciones" element={<NotificacionesPage />} />
            
            {/* Rutas exclusivas para Ciudadano */}
            <Route element={<ProtectedRoute allowedRoles={['CIUDADANO']} />}>
              <Route path="/tramites" element={<CatalogoTramitesPage />} />
              <Route path="/tramites/solicitar/:id" element={<SolicitudTramitePage />} />
              <Route path="/mis-solicitudes" element={<DashboardPage />} /> {/* Placeholder to prevent 404 */}
            </Route>

            {/* Rutas exclusivas para Funcionario */}
            <Route element={<ProtectedRoute allowedRoles={['FUNCIONARIO', 'ADMIN']} />}>
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
