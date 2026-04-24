import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificacionService } from '../api/apiService';
import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      if (user) {
        try {
          const res = await notificacionService.getUnreadCount();
          setUnreadCount(res.data.data.count);
        } catch (e) {
          console.error('Error fetching unread notifications', e);
        }
      }
    };
    fetchUnread();
    
    // Polling every 30s (MVP level)
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="layout-header">
      <div>
        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 500, color: 'var(--color-primary)' }}>
          Bienvenido, {user?.nombre} {user?.apellido}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div 
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => navigate('/notificaciones')}
        >
          <Bell size={20} color="var(--color-text-muted)" />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: 'var(--color-error)',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              minWidth: '16px',
              height: '16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px'
            }}>
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2" style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--color-info-bg)', padding: '0.5rem', borderRadius: '50%' }}>
            <User size={18} color="var(--color-info)" />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.nombre}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
              {user?.rol.toLowerCase()}
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', 
            color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' 
          }}
          title="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
