/*
  # Create Complete Database Schema for Dental Clinic Management

  1. New Tables
    - `Paciente` - Patient information with medical history
    - `Tratamiento` - Treatments and appointments with status tracking
    - `Inventario` - Inventory management for AI predictive analytics
    - `MensajeWhatsApp` - WhatsApp message audit trail for AI bot

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their clinic data

  3. Indexes
    - Optimized indexes for common queries and AI data processing
    - Performance indexes for calendar and patient lookups

  4. Custom Types
    - Enums for treatment states, types, and message categories
    - Structured data types for better data integrity
*/

-- Create custom types for better data integrity
CREATE TYPE estado_tratamiento AS ENUM ('pendiente', 'confirmado', 'completado', 'cancelado', 'pospuesto');
CREATE TYPE tipo_tratamiento AS ENUM ('profilaxis', 'restauracion', 'corona', 'puente', 'blanqueamiento', 'endodoncia', 'PPR', 'otro');
CREATE TYPE tipo_mensaje_whatsapp AS ENUM ('recordatorio', 'confirmacion', 'respuestaPaciente', 'notificacionInterna');
CREATE TYPE estado_envio_whatsapp AS ENUM ('enviado', 'fallido', 'recibido', 'leido');

-- Tabla de Pacientes
CREATE TABLE IF NOT EXISTS Paciente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numeroHistoria VARCHAR(255) UNIQUE NOT NULL,
  nombres VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  fechaNacimiento DATE NOT NULL,
  celular VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  alergias TEXT[] DEFAULT '{}',
  enfermedadesSistemicas TEXT[] DEFAULT '{}',
  religion VARCHAR(100),
  fechaCreacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fechaActualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Tratamientos
CREATE TABLE IF NOT EXISTS Tratamiento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacienteId UUID NOT NULL REFERENCES Paciente(id) ON DELETE CASCADE,
  tipo tipo_tratamiento NOT NULL,
  descripcion TEXT,
  fechaAgendada TIMESTAMP WITH TIME ZONE NOT NULL,
  estado estado_tratamiento DEFAULT 'pendiente' NOT NULL,
  piezaDental VARCHAR(50),
  boletaCodigo VARCHAR(255) UNIQUE,
  fechaCompletado TIMESTAMP WITH TIME ZONE,
  costo DECIMAL(10, 2),
  duracionMinutos INTEGER,
  fechaCreacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fechaActualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Inventario (para IA predictiva)
CREATE TABLE IF NOT EXISTS Inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombreMaterial VARCHAR(255) UNIQUE NOT NULL,
  cantidadActual INTEGER NOT NULL DEFAULT 0,
  unidadMedida VARCHAR(50),
  fechaVencimiento DATE,
  consumoMensualHistorico JSONB DEFAULT '[]'::jsonb,
  umbralAlertaBajo INTEGER NOT NULL DEFAULT 10,
  fechaUltimaActualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fechaCreacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Auditoría de Mensajes de WhatsApp (para IA bot)
CREATE TABLE IF NOT EXISTS MensajeWhatsApp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacienteId UUID NOT NULL REFERENCES Paciente(id) ON DELETE CASCADE,
  tratamientoId UUID REFERENCES Tratamiento(id) ON DELETE SET NULL,
  tipoMensaje tipo_mensaje_whatsapp NOT NULL,
  contenidoEnviado TEXT NOT NULL,
  contenidoRecibido TEXT,
  fechaEnvio TIMESTAMP WITH TIME ZONE NOT NULL,
  fechaRecepcion TIMESTAMP WITH TIME ZONE,
  estadoEnvio estado_envio_whatsapp NOT NULL,
  errorDetalle TEXT,
  fechaCreacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_paciente_celular ON Paciente (celular);
CREATE INDEX IF NOT EXISTS idx_paciente_numerohistoria ON Paciente (numeroHistoria);
CREATE INDEX IF NOT EXISTS idx_paciente_fechacreacion ON Paciente (fechaCreacion);

CREATE INDEX IF NOT EXISTS idx_tratamiento_pacienteid ON Tratamiento (pacienteId);
CREATE INDEX IF NOT EXISTS idx_tratamiento_fechaagendada ON Tratamiento (fechaAgendada);
CREATE INDEX IF NOT EXISTS idx_tratamiento_estado ON Tratamiento (estado);
CREATE INDEX IF NOT EXISTS idx_tratamiento_tipo ON Tratamiento (tipo);
CREATE INDEX IF NOT EXISTS idx_tratamiento_tipofechaestado ON Tratamiento (tipo, fechaAgendada, estado);

CREATE INDEX IF NOT EXISTS idx_inventario_nombrematerial ON Inventario (nombreMaterial);
CREATE INDEX IF NOT EXISTS idx_inventario_fechavencimiento ON Inventario (fechaVencimiento);
CREATE INDEX IF NOT EXISTS idx_inventario_cantidadactual ON Inventario (cantidadActual);

CREATE INDEX IF NOT EXISTS idx_mensajewhatsapp_pacienteid ON MensajeWhatsApp (pacienteId);
CREATE INDEX IF NOT EXISTS idx_mensajewhatsapp_tratamientoid ON MensajeWhatsApp (tratamientoId);
CREATE INDEX IF NOT EXISTS idx_mensajewhatsapp_fechaenvio ON MensajeWhatsApp (fechaEnvio);
CREATE INDEX IF NOT EXISTS idx_mensajewhatsapp_tipo ON MensajeWhatsApp (tipoMensaje);

-- Habilitar Row Level Security en todas las tablas
ALTER TABLE Paciente ENABLE ROW LEVEL SECURITY;
ALTER TABLE Tratamiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE Inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE MensajeWhatsApp ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acceso completo a usuarios autenticados
-- (Para una clínica pequeña, el acceso será controlado a nivel de aplicación)
CREATE POLICY "Allow full access to authenticated users" ON Paciente
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON Tratamiento
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON Inventario
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON MensajeWhatsApp
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Función para actualizar fechaActualizacion automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fechaActualizacion = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar fechaActualizacion
CREATE TRIGGER update_paciente_updated_at BEFORE UPDATE ON Paciente
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tratamiento_updated_at BEFORE UPDATE ON Tratamiento
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventario_updated_at BEFORE UPDATE ON Inventario
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();