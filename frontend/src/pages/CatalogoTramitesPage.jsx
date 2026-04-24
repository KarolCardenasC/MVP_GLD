import React, { useState, useEffect } from 'react';
import { tramiteService } from '../api/apiService';
import TramiteCard from '../components/TramiteCard';
import { Search } from 'lucide-react';

const CatalogoTramitesPage = () => {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchTramites = async () => {
      setLoading(true);
      try {
        const response = await tramiteService.getTramites(debouncedQuery);
        setTramites(response.data.data);
      } catch (error) {
        console.error("Error fetching tramites", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTramites();
  }, [debouncedQuery]);

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 style={{ margin: 0 }}>Catálogo de Trámites</h1>
          <p className="text-muted">Consulte los requisitos y solicite servicios de su municipio de forma digital.</p>
        </div>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search 
            size={18} 
            color="var(--color-text-muted)" 
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} 
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-6 text-muted">Cargando catálogo...</div>
      ) : tramites.length === 0 ? (
        <div className="card p-6 text-center text-muted">
          No se encontraron trámites según su búsqueda.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tramites.map((tramite) => (
            <TramiteCard key={tramite.id} tramite={tramite} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogoTramitesPage;
