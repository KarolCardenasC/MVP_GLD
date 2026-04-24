import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enumService } from '../api/apiService';
import { Building2 } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ nombre: '', apellido: '', correo: '', password: '', municipioId: '' });
  const [municipios, setMunicipios] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await enumService.getMunicipios();
        setMunicipios(response.data.data);
      } catch (err) {
        console.error("No se pudieron cargar los municipios");
      }
    };
    fetchMunicipios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        ...formData,
        municipioId: parseInt(formData.municipioId)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar la cuenta. Verifique los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-body)', padding: '2rem 0' }}>
      <div className="card" style={{ maxWidth: 500, width: '100%', padding: '2rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--color-primary-light)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Building2 size={32} color="white" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary)' }}>Registro Ciudadano</h1>
          <p className="text-muted">Cree su cuenta para trámites en línea</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">Nombre</label>
              <input className="form-control" type="text" id="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="apellido">Apellido</label>
              <input className="form-control" type="text" id="apellido" value={formData.apellido} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="correo">Correo Electrónico</label>
            <input className="form-control" type="email" id="correo" value={formData.correo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña (Mínimo 8 caracteres)</label>
            <input className="form-control" type="password" id="password" value={formData.password} onChange={handleChange} required minLength={8} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="municipioId">Municipio</label>
            <select className="form-control" id="municipioId" value={formData.municipioId} onChange={handleChange} required>
              <option value="">Seleccione su municipio...</option>
              {municipios.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full" 
            disabled={isLoading || !formData.municipioId}
            style={{ padding: '0.75rem', marginTop: '1rem' }}
          >
            {isLoading ? 'Registrando...' : 'Completar Registro'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <span className="text-muted">¿Ya tienes cuenta? </span>
          <Link to="/login" style={{ fontWeight: 500 }}>Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
