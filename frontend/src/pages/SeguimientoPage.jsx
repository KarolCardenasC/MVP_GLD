import React, { useState } from 'react';
import { solicitudService } from '../api/apiService';
import TimelineEstado from '../components/TimelineEstado';
import { Search, FileText } from 'lucide-react';

const SeguimientoPage = () => {
  const [folio, setFolio] = useState('');
  const [solicitud, setSolicitud] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!folio.trim()) return;
    
    setIsLoading(true);
    setError('');
    setSolicitud(null);
    setHistorial([]);

    try {
      const resSol = await solicitudService.getByFolio(folio.trim());
      const dataSol = resSol.data.data;
      setSolicitud(dataSol);

      const resHist = await solicitudService.getHistorial(dataSol.id);
      setHistorial(resHist.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'No se encontró ninguna solicitud con ese folio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1>Seguimiento de Trámite</h1>
        <p className="text-muted">Ingrese su número de folio para conocer el estado actual de su solicitud.</p>
      </div>

      <div className="card mb-8">
        <div className="card-body">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej. GLD-20260421-1234"
              value={folio}
              onChange={(e) => setFolio(e.target.value.toUpperCase())}
              style={{ flexGrow: 1 }}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <Search size={20} />
              Consultar
            </button>
          </form>
          {error && <div className="mt-4 text-sm text-error" style={{ color: 'var(--color-error)' }}>{error}</div>}
        </div>
      </div>

      {solicitud && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Detalles</h3>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <div className="text-xs text-muted text-uppercase mb-1">Trámite</div>
                  <div className="font-semibold">{solicitud.tramite.nombre}</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-muted text-uppercase mb-1">Folio</div>
                  <div className="font-bold">{solicitud.folio}</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-muted text-uppercase mb-1">Fecha Ingreso</div>
                  <div>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-muted text-uppercase mb-1">Resolución Estimada</div>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                    {new Date(solicitud.fechaEstimadaResolucion).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted text-uppercase mb-1">Estado Actual</div>
                  <span className="badge badge-default" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                    {solicitud.estado.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="card h-full">
              <div className="card-header">
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Historial en Tiempo Real</h3>
              </div>
              <div className="card-body">
                <TimelineEstado historial={historial} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeguimientoPage;
