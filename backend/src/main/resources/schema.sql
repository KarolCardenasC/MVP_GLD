-- =====================================================
-- GLD - DDL para crear las tablas
-- =====================================================

CREATE TABLE IF NOT EXISTS municipio (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    departamento VARCHAR(100),
    activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS usuario (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'CIUDADANO',
    municipio_id BIGINT REFERENCES municipio(id),
    verificado BOOLEAN NOT NULL DEFAULT true,
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_registro TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tramite (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    requisitos TEXT,
    categoria VARCHAR(100),
    costo NUMERIC(12,2) DEFAULT 0.00,
    dias_habiles_estimados INTEGER DEFAULT 5,
    requiere_pago BOOLEAN DEFAULT false,
    activo BOOLEAN NOT NULL DEFAULT true,
    municipio_id BIGINT REFERENCES municipio(id)
);

CREATE TABLE IF NOT EXISTS solicitud_tramite (
    id BIGSERIAL PRIMARY KEY,
    codigo_seguimiento VARCHAR(255) UNIQUE,
    estado VARCHAR(50) NOT NULL DEFAULT 'RADICADA',
    fecha_solicitud TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    observaciones TEXT,
    ciudadano_id BIGINT REFERENCES usuario(id),
    tramite_id BIGINT REFERENCES tramite(id),
    funcionario_id BIGINT REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS documento_adjunto (
    id BIGSERIAL PRIMARY KEY,
    nombre_archivo VARCHAR(255),
    tipo_archivo VARCHAR(100),
    ruta_archivo VARCHAR(500),
    tamano BIGINT,
    fecha_subida TIMESTAMP,
    solicitud_id BIGINT REFERENCES solicitud_tramite(id)
);

CREATE TABLE IF NOT EXISTS historial_estado (
    id BIGSERIAL PRIMARY KEY,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    comentario TEXT,
    fecha_cambio TIMESTAMP,
    solicitud_id BIGINT REFERENCES solicitud_tramite(id),
    usuario_id BIGINT REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS notificacion (
    id BIGSERIAL PRIMARY KEY,
    mensaje TEXT,
    tipo VARCHAR(50),
    leida BOOLEAN DEFAULT false,
    fecha TIMESTAMP,
    usuario_id BIGINT REFERENCES usuario(id),
    solicitud_id BIGINT REFERENCES solicitud_tramite(id)
);
