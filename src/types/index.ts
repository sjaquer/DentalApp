export interface Patient {
  id: string;
  numeroHistoria: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  celular: string;
  email?: string;
  alergias: string[];
  enfermedadesSistemicas: string[];
  religion?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  edad?: number;
}

export interface Treatment {
  id: string;
  pacienteId: string;
  tipo: TreatmentType;
  descripcion?: string;
  fechaAgendada: string;
  estado: TreatmentStatus;
  piezaDental?: string;
  boletaCodigo?: string;
  fechaCompletado?: string;
  costo?: number;
  duracionMinutos?: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export type TreatmentType = 
  | 'profilaxis'
  | 'restauracion'
  | 'corona'
  | 'puente'
  | 'blanqueamiento'
  | 'endodoncia'
  | 'PPR'
  | 'otro';

export type TreatmentStatus = 
  | 'pendiente'
  | 'confirmado'
  | 'completado'
  | 'cancelado'
  | 'pospuesto';

export interface TreatmentGoal {
  tipo: TreatmentType;
  metaCantidad: number;
  completados: number;
  porcentaje: number;
}

export interface InventoryItem {
  id: string;
  nombreMaterial: string;
  cantidadActual: number;
  unidadMedida: string;
  fechaVencimiento?: string;
  umbralAlertaBajo: number;
  estadoAlerta: 'verde' | 'amarillo' | 'rojo';
}

export interface WhatsAppMessage {
  id: string;
  pacienteId: string;
  tratamientoId?: string;
  tipoMensaje: 'recordatorio' | 'confirmacion' | 'respuestaPaciente' | 'notificacionInterna';
  contenidoEnviado: string;
  contenidoRecibido?: string;
  fechaEnvio: string;
  fechaRecepcion?: string;
  estadoEnvio: 'enviado' | 'fallido' | 'recibido' | 'leido';
  errorDetalle?: string;
}