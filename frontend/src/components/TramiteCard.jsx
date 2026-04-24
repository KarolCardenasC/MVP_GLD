import React from 'react';
import { Clock, DollarSign, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TramiteCard = ({ tramite }) => {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-body" style={{ flexGrow: 1 }}>
        <div className="flex justify-between items-start mb-4">
          <span className="badge badge-info">{tramite.categoria || 'General'}</span>
          {tramite.requierePago && <span className="badge badge-warning">Requiere Pago</span>}
        </div>
        
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{tramite.nombre}</h3>
        <p className="text-muted text-sm mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tramite.descripcion}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Clock size={16} />
            <span>{tramite.diasHabilesEstimados} días hábiles</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <DollarSign size={16} />
            <span>${tramite.costo === 0 ? 'Gratuito' : tramite.costo.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer flex justify-between items-center">
        <button 
          className="btn btn-outline"
          onClick={() => alert(`Requisitos:\n${tramite.requisitos}`)}
        >
          <FileText size={16} /> Requisitos
        </button>
        <button 
          className="btn btn-accent"
          onClick={() => navigate(`/tramites/solicitar/${tramite.id}`, { state: { tramite } })}
        >
          Iniciar Trámite
        </button>
      </div>
    </div>
  );
};

export default TramiteCard;
