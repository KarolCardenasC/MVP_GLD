import React, { useState, useEffect } from 'react';
import { notificacionService } from '../api/apiService';
import { Bell, CheckSquare } from 'lucide-react';

const NotificacionesPage = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const fetchNotificaciones = async () => {
    try {
      const response = await notificacionService.getMisNotificaciones();
      setNotificaciones(response.data.data);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificacionService.marcarLeida(id);
      setNotificaciones(notificaciones.map(n => n.id === id ? { ...n, leida: true } : n));
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  };

  if (loading) return <div className="p-6">Cargando notificaciones...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 style={{ margin: 0 }}>Centro de Notificaciones</h1>
          <p className="text-muted">Revise avisos y actualizaciones sobre sus trámites.</p>
        </div>
      </div>

      <div className="card">
        {notificaciones.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <Bell size={48} color="var(--color-border)" style={{ margin: '0 auto 1rem auto' }} />
            No tiene notificaciones en su bandeja.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--color-border)' }}>
            {notificaciones.map(noti => (
              <div 
                key={noti.id} 
                style={{ 
                  backgroundColor: noti.leida ? 'white' : 'var(--color-info-bg)', 
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.5rem',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                  <Bell size={24} color={noti.leida ? 'var(--color-text-muted)' : 'var(--color-info)'} />
                </div>
                
                <div style={{ flexGrow: 1 }}>
                  <div className="flex justify-between mb-1">
                    <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: noti.leida ? 500 : 600 }}>{noti.titulo}</h3>
                    <span className="text-xs text-muted">{new Date(noti.fechaCreacion).toLocaleString()}</span>
                  </div>
                  <p className={noti.leida ? 'text-muted text-sm' : 'text-sm'} style={{ margin: 0 }}>
                    {noti.mensaje}
                  </p>
                </div>
                
                {!noti.leida && (
                  <div style={{ flexShrink: 0 }}>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => markAsRead(noti.id)}
                    >
                      <CheckSquare size={14} /> Marcar Leída
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificacionesPage;
