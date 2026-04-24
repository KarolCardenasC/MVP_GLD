-- =====================================================
-- GLD - Datos semilla para Ventanilla Única de Trámites
-- =====================================================

-- Municipios
INSERT INTO municipio (id, nombre, departamento, activo) VALUES
(1, 'Bogotá D.C.', 'Cundinamarca', true),
(2, 'Medellín', 'Antioquia', true),
(3, 'Cali', 'Valle del Cauca', true),
(4, 'Barranquilla', 'Atlántico', true),
(5, 'Cartagena', 'Bolívar', true)
ON CONFLICT (id) DO NOTHING;

-- Admin user (password: admin123)
INSERT INTO usuario (id, nombre, apellido, correo, password_hash, rol, municipio_id, verificado, activo, fecha_registro) VALUES
(1, 'Admin', 'GLD', 'admin@gld.gov.co', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 1, true, true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Funcionario user (password: func1234)
INSERT INTO usuario (id, nombre, apellido, correo, password_hash, rol, municipio_id, verificado, activo, fecha_registro) VALUES
(2, 'Carlos', 'Rodríguez', 'funcionario@gld.gov.co', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'FUNCIONARIO', 1, true, true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Trámites de ejemplo para Bogotá
INSERT INTO tramite (id, nombre, descripcion, requisitos, categoria, costo, dias_habiles_estimados, requiere_pago, activo, municipio_id) VALUES
(1, 'Certificado de Estratificación', 'Solicitud de certificado de estrato socioeconómico del predio.', 'Cédula de ciudadanía, Dirección del predio, Recibo de servicios públicos', 'Certificados', 0.00, 5, false, true, 1),
(2, 'Licencia de Construcción', 'Permiso para realizar obras de construcción en un predio.', 'Escritura del predio, Planos arquitectónicos aprobados, Estudio de suelos, Cédula del propietario', 'Licencias', 350000.00, 15, true, true, 1),
(3, 'Registro de Mascota', 'Registro oficial de animales domésticos en el municipio.', 'Cédula del propietario, Carnet de vacunación del animal, Fotografía reciente del animal', 'Registros', 25000.00, 3, true, true, 1),
(4, 'Permiso de Eventos Públicos', 'Autorización para realizar eventos en espacios públicos del municipio.', 'Cédula del organizador, Plan de logística del evento, Póliza de responsabilidad civil, Carta de solicitud', 'Permisos', 150000.00, 10, true, true, 1),
(5, 'Certificado de Residencia', 'Documento que acredita el lugar de residencia del ciudadano.', 'Cédula de ciudadanía, Recibo de servicios públicos, Declaración jurada', 'Certificados', 15000.00, 3, true, true, 1),
(6, 'Solicitud de Poda de Árboles', 'Solicitud para poda o tala de árboles en espacio público o privado.', 'Cédula del solicitante, Fotografías del árbol, Dirección exacta, Justificación de la solicitud', 'Servicios Ambientales', 0.00, 8, false, true, 1),
(7, 'Inscripción Programa Social', 'Registro en los programas de asistencia social del municipio.', 'Cédula de ciudadanía, Certificado del SISBEN, Carta de solicitud', 'Programas Sociales', 0.00, 10, false, true, 1)
ON CONFLICT (id) DO NOTHING;

-- Trámites para Medellín
INSERT INTO tramite (id, nombre, descripcion, requisitos, categoria, costo, dias_habiles_estimados, requiere_pago, activo, municipio_id) VALUES
(8, 'Certificado de Estratificación', 'Solicitud de certificado de estrato socioeconómico para Medellín.', 'Cédula de ciudadanía, Dirección del predio', 'Certificados', 0.00, 5, false, true, 2),
(9, 'Permiso de Ocupación de Espacio Público', 'Autorización temporal para uso de espacio público.', 'Cédula, Plano de ubicación, Carta de solicitud', 'Permisos', 80000.00, 7, true, true, 2)
ON CONFLICT (id) DO NOTHING;

-- Reset sequences
SELECT setval('municipio_id_seq', (SELECT MAX(id) FROM municipio));
SELECT setval('usuario_id_seq', (SELECT MAX(id) FROM usuario));
SELECT setval('tramite_id_seq', (SELECT MAX(id) FROM tramite));
