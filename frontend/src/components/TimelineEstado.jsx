import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const getEstadoConfig = (estado) => {
  switch (estado) {
    case 'EN_REVISION': return { label: 'En Revisión', color: 'var(--color-info)', icon: <Clock size={20} />, bg: 'var(--color-info-bg)' };
    case 'EN_PROCESO': return { label: 'En Proceso', color: 'var(--color-warning)', icon: <AlertCircle size={20} />, bg: 'var(--color-warning-bg)' };
    case 'APROBADO': return { label: 'Aprobado', color: 'var(--color-success)', icon: <CheckCircle size={20} />, bg: 'var(--color-success-bg)' };
    case 'RECHAZADO': return { label: 'Rechazado', color: 'var(--color-error)', icon: <XCircle size={20} />, bg: 'var(--color-error-bg)' };
    case 'COMPLETADO': return { label: 'Completado', color: 'var(--color-success)', icon: <CheckCircle size={20} />, bg: 'var(--color-success-bg)' };
    default: return { label: estado, color: 'var(--color-text-muted)', icon: <Clock size={20} />, bg: 'var(--color-bg-body)' };
  }
};

const TimelineEstado = ({ historial }) => {
  if (!historial || historial.length === 0) return null;

  return (
    <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
      {/* Linea conectora */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 11, width: 2, backgroundColor: 'var(--color-border)', zIndex: 0 }}></div>

      {historial.map((h, index) => {
        const config = getEstadoConfig(h.estadoNuevo);
        const isLast = index === historial.length - 1;
        
        return (
          <div key={h.id} style={{ position: 'relative', zIndex: 1, marginBottom: isLast ? 0 : '2rem' }}>
            {/* Dot */}
            <div style={{ 
              position: 'absolute', left: '-1.5rem', top: 0, 
              width: 24, height: 24, borderRadius: '50%', 
              backgroundColor: config.bg, color: config.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${isLast ? config.color : 'var(--color-border)'}`
            }}>
              <div style={{ transform: 'scale(0.7)' }}>{config.icon}</div>
            </div>
            
            {/* Content */}
            <div className="card" style={{ padding: '1rem', borderLeft: isLast ? `4px solid ${config.color}` : `1px solid var(--color-border)` }}>
              <div className="flex justify-between items-start mb-2">
                <span className={`badge`} style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.color}33` }}>
                  {config.label}
                </span>
                <span className="text-muted text-sm">
                  {new Date(h.fechaCambio).toLocaleString()}
                </span>
              </div>
              
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                {h.observaciones || 'Sin observaciones.'}
              </p>
              
              {h.funcionarioId && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Actualizado por funcionario asignado
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineEstado;
