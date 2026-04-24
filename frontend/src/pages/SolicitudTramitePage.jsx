import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { solicitudService } from '../api/apiService';
import { CheckCircle, AlertCircle, FileUp, Hash, Save, AlertTriangle, FileCheck, Trash2 } from 'lucide-react';

const SolicitudTramitePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tramite = location.state?.tramite; 

  const [step, setStep] = useState(1);
  const [solicitudId, setSolicitudId] = useState(null); // Para guardar borradores
  const [folioResult, setFolioResult] = useState('');
  
  // Step 1: Form Data
  const [formData, setFormData] = useState({
    asunto: '',
    cedula: '',
    fechaNacimiento: '',
    detalle: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Step 2: Docs
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [docErrors, setDocErrors] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tramite) {
    return (
      <div className="card p-6">
        <h2 className="mb-4">Error de selección</h2>
        <p>No se seleccionó un trámite válido.</p>
        <button className="btn btn-primary" onClick={() => navigate('/tramites')}>Volver al Catálogo</button>
      </div>
    );
  }

  const validateForm = () => {
    let errors = {};
    if (!formData.asunto.trim()) errors.asunto = 'El asunto es obligatorio';
    if (!formData.cedula.trim() || !/^\d{8,10}$/.test(formData.cedula)) errors.cedula = 'Cédula inválida (8-10 dígitos)';
    if (!formData.fechaNacimiento) errors.fechaNacimiento = 'Fecha es obligatoria';
    if (!formData.detalle.trim()) errors.detalle = 'Debe incluir un detalle o justificación';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (formErrors[e.target.id]) {
      setFormErrors({ ...formErrors, [e.target.id]: null });
    }
  };

  const handleDocChange = (e) => {
    const files = Array.from(e.target.files);
    let validFiles = [];
    let errorMsg = '';

    files.forEach(file => {
      // Validar tamaño: max 10MB
      if (file.size > 10 * 1024 * 1024) {
        errorMsg += `El archivo ${file.name} supera los 10MB. `;
      } 
      // Validar tipo (aunque el input ya tiene accept)
      else if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        errorMsg += `El archivo ${file.name} tiene un formato no válido. `;
      } else {
        validFiles.push(file);
      }
    });

    if (errorMsg) setDocErrors(errorMsg);
    else setDocErrors('');

    setSelectedDocs([...selectedDocs, ...validFiles]);
  };

  const removeDoc = (index) => {
    setSelectedDocs(selectedDocs.filter((_, i) => i !== index));
  };

  // Guardar como borrador
  const saveDraft = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        tramiteId: tramite.id,
        datosFormulario: JSON.stringify(formData),
        observaciones: 'Borrador guardado',
        estado: 'BORRADOR'
      };

      if (solicitudId) {
        await solicitudService.update(solicitudId, payload);
        alert('Borrador actualizado correctamente');
      } else {
        const res = await solicitudService.create(payload);
        setSolicitudId(res.data.data.id);
        alert('Borrador creado correctamente');
      }
    } catch (error) {
      alert('Error al guardar borrador: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enviar a revisión
  const submitSolicitud = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        tramiteId: tramite.id,
        datosFormulario: JSON.stringify(formData),
        observaciones: 'Solicitud enviada para revisión',
        estado: 'EN_REVISION'
      };

      let solId = solicitudId;
      let finalFolio = '';

      if (solId) {
        const res = await solicitudService.update(solId, payload);
        finalFolio = res.data.data.folio;
      } else {
        const res = await solicitudService.create(payload);
        solId = res.data.data.id;
        finalFolio = res.data.data.folio;
      }

      if (selectedDocs.length > 0) {
        for (let file of selectedDocs) {
          await solicitudService.uploadDocument(solId, file, true);
        }
      }

      setFolioResult(finalFolio);
      setStep(4);
    } catch (error) {
      alert('Error en el envío: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="card">
      <div className="card-header">
        <h3 style={{ margin: 0 }}>Paso 1: Datos de la Solicitud</h3>
      </div>
      <div className="card-body">
        
        {tramite.requierePago && (
          <div className="alert alert-warning mb-4 flex gap-3 items-start">
            <AlertTriangle size={24} color="var(--color-warning)" />
            <div>
              <strong style={{ color: 'var(--color-warning)' }}>¡Atención! Este trámite requiere pago previo.</strong>
              <p className="mt-1 mb-0 text-sm">El costo del trámite es de <b>${tramite.costo.toLocaleString()}</b>. El funcionario le indicará los medios de pago tras revisar su solicitud.</p>
            </div>
          </div>
        )}

        <div className="alert alert-info mb-6" style={{ backgroundColor: 'var(--color-bg-body)' }}>
          <AlertCircle size={20} />
          <div>
            <strong>Requisitos Obligatorios:</strong>
            <p className="mt-2 text-sm">{tramite.requisitos}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label className="form-label" htmlFor="asunto">Asunto o Título Corto *</label>
            <input className={`form-control ${formErrors.asunto ? 'border-red-500' : ''}`} type="text" id="asunto" value={formData.asunto} onChange={handleFormChange} />
            {formErrors.asunto && <span className="text-xs text-red-500 mt-1 block">{formErrors.asunto}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cedula">Cédula del Solicitante *</label>
            <input className={`form-control ${formErrors.cedula ? 'border-red-500' : ''}`} type="text" id="cedula" value={formData.cedula} onChange={handleFormChange} placeholder="Ej: 12345678" />
            {formErrors.cedula && <span className="text-xs text-red-500 mt-1 block">{formErrors.cedula}</span>}
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="form-label" htmlFor="fechaNacimiento">Fecha de Nacimiento *</label>
          <input className={`form-control ${formErrors.fechaNacimiento ? 'border-red-500' : ''}`} type="date" id="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleFormChange} />
          {formErrors.fechaNacimiento && <span className="text-xs text-red-500 mt-1 block">{formErrors.fechaNacimiento}</span>}
        </div>

        <div className="form-group mb-6">
          <label className="form-label" htmlFor="detalle">Detalles o Justificación *</label>
          <textarea className={`form-control ${formErrors.detalle ? 'border-red-500' : ''}`} id="detalle" rows={4} value={formData.detalle} onChange={handleFormChange} placeholder="Explique brevemente su solicitud..."></textarea>
          {formErrors.detalle && <span className="text-xs text-red-500 mt-1 block">{formErrors.detalle}</span>}
        </div>

        <div className="flex justify-between items-center border-t pt-4 border-[var(--color-border)]">
          <button className="btn btn-outline flex gap-2 items-center" onClick={saveDraft} disabled={isSubmitting}>
            <Save size={18} /> Guardar Borrador
          </button>
          <button className="btn btn-primary" onClick={() => { if(validateForm()) setStep(2) }}>
            Siguiente Paso
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="card">
      <div className="card-header">
        <h3 style={{ margin: 0 }}>Paso 2: Documentos de Soporte</h3>
      </div>
      <div className="card-body">
        
        <p className="text-sm text-muted mb-4">
          Adjunte los documentos requeridos. <b>Tamaño máximo por archivo: 10MB</b>.
        </p>

        {docErrors && (
          <div className="alert alert-error mb-4">
            {docErrors}
          </div>
        )}

        <div className="form-group mb-6">
          <div style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-bg-body)' }}>
            <FileUp size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <input 
              type="file" 
              multiple 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleDocChange}
              id="file-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="btn btn-outline" style={{ display: 'inline-flex', cursor: 'pointer' }}>Explorar Archivos</label>
          </div>
        </div>

        {selectedDocs.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3">Archivos Listos para Enviar:</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedDocs.map((doc, idx) => (
                <li key={idx} className="flex justify-between items-center p-3 rounded" style={{ backgroundColor: 'var(--color-bg-body)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-3">
                    <FileCheck size={20} color="var(--color-success)" />
                    <span className="text-sm">{doc.name}</span>
                    <span className="text-xs text-muted">({(doc.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button onClick={() => removeDoc(idx)} className="text-red-500 hover:text-red-700 p-1" title="Eliminar">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center border-t pt-4 border-[var(--color-border)]">
          <button className="btn btn-outline" onClick={() => setStep(1)} disabled={isSubmitting}>Volver</button>
          <button className="btn btn-primary" onClick={() => setStep(3)}>
            Revisar Resumen
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="card">
      <div className="card-header">
        <h3 style={{ margin: 0 }}>Paso 3: Resumen de su Solicitud</h3>
      </div>
      <div className="card-body">
        
        <div className="mb-6">
          <h4 className="text-sm text-muted text-uppercase font-semibold mb-2">Datos del Formulario</h4>
          <div className="grid grid-cols-2 gap-y-2 text-sm bg-gray-50 p-4 rounded" style={{ backgroundColor: 'var(--color-bg-body)' }}>
            <div className="font-semibold">Asunto:</div><div>{formData.asunto}</div>
            <div className="font-semibold">Cédula:</div><div>{formData.cedula}</div>
            <div className="font-semibold">Fecha Nacimiento:</div><div>{formData.fechaNacimiento}</div>
            <div className="col-span-2 mt-2">
              <div className="font-semibold mb-1">Justificación:</div>
              <div className="p-2 border rounded border-[var(--color-border)] bg-white">{formData.detalle}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm text-muted text-uppercase font-semibold mb-2">Documentos Adjuntos ({selectedDocs.length})</h4>
          {selectedDocs.length === 0 ? (
            <p className="text-sm italic text-muted">Ningún documento adjunto.</p>
          ) : (
            <ul className="text-sm list-disc pl-5">
              {selectedDocs.map((doc, idx) => <li key={idx}>{doc.name}</li>)}
            </ul>
          )}
        </div>

        {tramite.requierePago && (
          <div className="mb-6 p-4 rounded" style={{ borderLeft: '4px solid var(--color-warning)', backgroundColor: '#fffbeb' }}>
            <strong className="text-sm text-yellow-800">Costo del Trámite: ${tramite.costo.toLocaleString()}</strong>
          </div>
        )}

        <div className="flex justify-between items-center border-t pt-4 border-[var(--color-border)]">
          <button className="btn btn-outline" onClick={() => setStep(2)} disabled={isSubmitting}>Modificar Adjuntos</button>
          <button className="btn btn-accent" onClick={submitSolicitud} disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : 'Confirmar y Enviar Solicitud'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="card text-center" style={{ borderTop: '4px solid var(--color-success)' }}>
      <div className="card-body p-6" style={{ padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <CheckCircle size={64} color="var(--color-success)" />
        </div>
        <h2>¡Solicitud Recibida Exitosamente!</h2>
        <p className="text-muted mb-6">Su trámite ha sido radicado y enviado a revisión.</p>
        
        <div style={{ backgroundColor: 'var(--color-bg-body)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '2rem' }}>
          <div className="text-sm text-muted mb-1 text-uppercase font-semibold">Folio de Seguimiento</div>
          <div className="flex items-center justify-center gap-2" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            <Hash size={24} /> {folioResult}
          </div>
        </div>

        <p className="text-sm mb-6 text-muted">
          Se ha enviado un correo electrónico con esta confirmación. Puede hacer seguimiento en línea con su folio.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/seguimiento" className="btn btn-primary">Ir a Seguimiento</Link>
          <Link to="/dashboard" className="btn btn-outline">Volver al Inicio</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button className="btn btn-outline mb-4" onClick={() => navigate(-1)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
          Cancelar y Volver
        </button>
        <h1 style={{ margin: 0 }}>{tramite.nombre}</h1>
        <p className="text-muted">{tramite.categoria}</p>
      </div>

      <div className="flex mb-6 gap-2">
        <div style={{ height: '6px', flex: 1, backgroundColor: step >= 1 ? 'var(--color-accent)' : 'var(--color-border)', borderRadius: '3px' }}></div>
        <div style={{ height: '6px', flex: 1, backgroundColor: step >= 2 ? 'var(--color-accent)' : 'var(--color-border)', borderRadius: '3px' }}></div>
        <div style={{ height: '6px', flex: 1, backgroundColor: step >= 3 ? 'var(--color-accent)' : 'var(--color-border)', borderRadius: '3px' }}></div>
        <div style={{ height: '6px', flex: 1, backgroundColor: step >= 4 ? 'var(--color-success)' : 'var(--color-border)', borderRadius: '3px' }}></div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
};

export default SolicitudTramitePage;
