import axios from 'axios';

const API_URL = 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const enumService = {
  getMunicipios: () => api.get('/municipios'),
};

export const tramiteService = {
  getTramites: (query = '') => api.get(`/tramites${query ? `?query=${query}` : ''}`),
  getTramiteById: (id) => api.get(`/tramites/${id}`),
};

export const solicitudService = {
  create: (data) => api.post('/solicitudes', data),
  update: (id, data) => api.put(`/solicitudes/${id}`, data),
  getMySolicitudes: () => api.get('/solicitudes'),
  getByFolio: (folio) => api.get(`/solicitudes/folio/${folio}`),
  getHistorial: (id) => api.get(`/solicitudes/${id}/historial`),
  updateEstado: (id, payload) => api.put(`/solicitudes/${id}/estado`, payload),
  uploadDocument: (solicitudId, file, obligatorio = true) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('obligatorio', obligatorio);
    return api.post(`/solicitudes/${solicitudId}/documentos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getDocumentos: (id) => api.get(`/solicitudes/${id}/documentos`),
};

export const notificacionService = {
  getMisNotificaciones: () => api.get('/notificaciones'),
  getUnreadCount: () => api.get('/notificaciones/no-leidas'),
  marcarLeida: (id) => api.put(`/notificaciones/${id}/leer`),
};

export default api;
