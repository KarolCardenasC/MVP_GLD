-- =====================================================
-- GLD - DDL para crear las tablas
-- Columnas alineadas con las entidades JPA
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
    folio VARCHAR(20) UNIQUE,
    tramite_id BIGINT NOT NULL REFERENCES tramite(id),
    ciudadano_id BIGINT NOT NULL REFERENCES usuario(id),
    estado VARCHAR(30) NOT NULL DEFAULT 'EN_REVISION',
    datos_formulario TEXT,
    fecha_solicitud TIMESTAMP,
    fecha_estimada_resolucion DATE,
    observaciones TEXT
);

CREATE TABLE IF NOT EXISTS documento_adjunto (
    id BIGSERIAL PRIMARY KEY,
    solicitud_id BIGINT NOT NULL REFERENCES solicitud_tramite(id),
    nombre_archivo VARCHAR(255) NOT NULL,
    tipo_archivo VARCHAR(10) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    obligatorio BOOLEAN NOT NULL DEFAULT true,
    tamano_bytes BIGINT,
    fecha_carga TIMESTAMP
);

CREATE TABLE IF NOT EXISTS historial_estado (
    id BIGSERIAL PRIMARY KEY,
    solicitud_id BIGINT NOT NULL REFERENCES solicitud_tramite(id),
    estado_anterior VARCHAR(30),
    estado_nuevo VARCHAR(30) NOT NULL,
    observaciones TEXT,
    funcionario_id BIGINT REFERENCES usuario(id),
    fecha_cambio TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notificacion (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuario(id),
    solicitud_id BIGINT REFERENCES solicitud_tramite(id),
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT false,
    fecha_creacion TIMESTAMP
);
