import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Search, Activity, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const isCiudadano = user?.rol === 'CIUDADANO';
  const isFuncionario = user?.rol === 'FUNCIONARIO';

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} />, show: true },
    { name: 'Catálogo de Trámites', path: '/tramites', icon: <Search size={20} />, show: isCiudadano },
    { name: 'Mis Solicitudes', path: '/mis-solicitudes', icon: <FileText size={20} />, show: isCiudadano },
    { name: 'Seguimiento por Folio', path: '/seguimiento', icon: <Activity size={20} />, show: true },
    { name: 'Notificaciones', path: '/notificaciones', icon: <Bell size={20} />, show: true },
    // Funcionario only links (out of MVP scope but structural)
    { name: 'Bandeja de Entrada', path: '/bandeja', icon: <FileText size={20} />, show: isFuncionario },
  ];

  return (
    <aside className="layout-sidebar">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>GLD Portal</h2>
        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Ventanilla Única</span>
      </div>
      
      <nav style={{ padding: '1rem 0', flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {menuItems.filter(item => item.show).map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                  backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                  textDecoration: 'none',
                  borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent',
                  transition: 'all 0.2s',
                })}
              >
                {item.icon}
                <span style={{ fontSize: '0.875rem' }}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Municipio</div>
        <div style={{ fontWeight: 600 }}>{user?.municipioNombre}</div>
      </div>
    </aside>
  );
};

export default Sidebar;
