import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { solicitudService, notificacionService } from '../api/apiService';
import { FileText, Search, Clock, CheckCircle } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ activas: 0, completadas: 0, notificaciones: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user.rol === 'CIUDADANO') {
          const [solRes, notiRes] = await Promise.all([
            solicitudService.getMySolicitudes(),
            notificacionService.getUnreadCount()
          ]);
          
          const solicitudes = solRes.data.data || [];
          setStats({
            activas: solicitudes.filter(s => !['COMPLETADO', 'RECHAZADO'].includes(s.estado)).length,
            completadas: solicitudes.filter(s => s.estado === 'COMPLETADO').length,
            notificaciones: notiRes.data.data.count || 0
          });
          
          setRecent(solicitudes.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) return <div>Cargando panel de control...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 style={{ marginTop: 0 }}>Panel de Control Ciudadano</h1>
        <p className="text-muted">Resumen de sus trámites con la administración pública.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6" style={{ borderTop: '4px solid var(--color-warning)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted text-sm mb-1 font-semibold text-uppercase">Trámites Activos</p>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.activas}</h2>
            </div>
            <div style={{ backgroundColor: 'var(--color-warning-bg)', padding: '1rem', borderRadius: '50%' }}>
              <Clock color="var(--color-warning)" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6" style={{ borderTop: '4px solid var(--color-success)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted text-sm mb-1 font-semibold text-uppercase">Completados</p>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.completadas}</h2>
            </div>
            <div style={{ backgroundColor: 'var(--color-success-bg)', padding: '1rem', borderRadius: '50%' }}>
              <CheckCircle color="var(--color-success)" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6" style={{ borderTop: '4px solid var(--color-info)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted text-sm mb-1 font-semibold text-uppercase">Notificaciones Pendientes</p>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.notificaciones}</h2>
            </div>
            <div style={{ backgroundColor: 'var(--color-info-bg)', padding: '1rem', borderRadius: '50%' }}>
              <FileText color="var(--color-info)" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Trámites Recientes</h3>
            <Link to="/mis-solicitudes" className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Ver todos</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recent.length === 0 ? (
              <div className="p-6 text-center text-muted">No tiene trámites registrados.</div>
            ) : (
              <table className="table-formal" style={{ borderBottom: 'none' }}>
                <tbody>
                  {recent.map(solicitud => (
                    <tr key={solicitud.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{solicitud.tramite.nombre}</div>
                        <div className="text-xs text-muted">Folio: {solicitud.folio}</div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-default">{solicitud.estado.replace('_', ' ')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
          <div className="card-body flex justify-between flex-col" style={{ height: '100%' }}>
            <div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '0.75rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <Search size={32} color="white" />
              </div>
              <h3 style={{ color: 'white' }}>¿Necesita realizar un nuevo trámite?</h3>
              <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
                Explore el catálogo de trámites y servicios disponibles para su municipio y realice solicitudes 100% en línea.
              </p>
            </div>
            <Link to="/tramites" className="btn" style={{ backgroundColor: 'white', color: 'var(--color-primary)', width: 'max-content' }}>
              Consultar Catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
