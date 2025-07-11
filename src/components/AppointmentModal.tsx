import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, FileText, Save, AlertCircle } from 'lucide-react';
import { Patient, TreatmentType } from '../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { format, addDays, startOfDay, isBefore, isWeekend } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSave: () => void;
}

const treatmentOptions: { value: TreatmentType; label: string; description: string }[] = [
  { value: 'profilaxis', label: 'Profilaxis', description: 'Limpieza dental profesional y prevención' },
  { value: 'restauracion', label: 'Restauración', description: 'Reparación de caries con resina o amalgama' },
  { value: 'corona', label: 'Corona', description: 'Prótesis fija para restaurar diente dañado' },
  { value: 'puente', label: 'Puente', description: 'Prótesis fija para reemplazar dientes perdidos' },
  { value: 'blanqueamiento', label: 'Blanqueamiento', description: 'Tratamiento estético para aclarar dientes' },
  { value: 'endodoncia', label: 'Endodoncia', description: 'Tratamiento de conducto radicular' },
  { value: 'PPR', label: 'PPR', description: 'Prótesis parcial removible' },
  { value: 'otro', label: 'Otro', description: 'Otro tipo de tratamiento dental' }
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const schema = yup.object({
  tipo: yup.string().required('Debe seleccionar un tipo de tratamiento'),
  fechaAgendada: yup.string().required('Debe seleccionar una fecha'),
  hora: yup.string().required('Debe seleccionar una hora'),
  piezaDental: yup.string(),
  descripcion: yup.string(),
  duracionMinutos: yup.number().min(15, 'Duración mínima 15 minutos').max(240, 'Duración máxima 4 horas')
});

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentType | ''>('');
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      duracionMinutos: 60
    }
  });

  const watchedDate = watch('fechaAgendada');
  const watchedTreatment = watch('tipo');

  // Generate available dates (next 60 days, excluding weekends)
  useEffect(() => {
    const dates: Date[] = [];
    const today = startOfDay(new Date());
    
    for (let i = 1; i <= 60; i++) {
      const date = addDays(today, i);
      if (!isWeekend(date)) {
        dates.push(date);
      }
    }
    
    setAvailableDates(dates);
  }, []);

  // Fetch occupied time slots when date changes
  useEffect(() => {
    if (watchedDate) {
      fetchOccupiedSlots(watchedDate);
    }
  }, [watchedDate]);

  // Update treatment description when treatment type changes
  useEffect(() => {
    if (watchedTreatment) {
      setSelectedTreatment(watchedTreatment as TreatmentType);
    }
  }, [watchedTreatment]);

  const fetchOccupiedSlots = async (date: string) => {
    try {
      const startOfSelectedDay = new Date(date);
      startOfSelectedDay.setHours(0, 0, 0, 0);
      
      const endOfSelectedDay = new Date(date);
      endOfSelectedDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('Tratamiento')
        .select('fechaAgendada')
        .gte('fechaAgendada', startOfSelectedDay.toISOString())
        .lte('fechaAgendada', endOfSelectedDay.toISOString())
        .in('estado', ['pendiente', 'confirmado']);

      if (error) throw error;

      const occupied = data.map(appointment => {
        const date = new Date(appointment.fechaAgendada);
        return format(date, 'HH:mm');
      });

      setOccupiedSlots(occupied);
    } catch (error) {
      console.error('Error fetching occupied slots:', error);
      setOccupiedSlots([]);
    }
  };

  const onSubmit = async (data: any) => {
    if (!patient) {
      toast.error('No se ha seleccionado un paciente');
      return;
    }

    setLoading(true);
    try {
      // Combine date and time
      const appointmentDateTime = new Date(`${data.fechaAgendada}T${data.hora}:00`);
      
      // Check for conflicts
      if (occupiedSlots.includes(data.hora)) {
        toast.error('El horario seleccionado ya está ocupado');
        setLoading(false);
        return;
      }

      const appointmentData = {
        pacienteId: patient.id,
        tipo: data.tipo,
        descripcion: data.descripcion || null,
        fechaAgendada: appointmentDateTime.toISOString(),
        estado: 'pendiente',
        piezaDental: data.piezaDental || null,
        duracionMinutos: data.duracionMinutos || 60,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      };

      const { error } = await supabase
        .from('Tratamiento')
        .insert([appointmentData]);

      if (error) throw error;

      toast.success('Cita agendada exitosamente');
      onSave();
      reset();
      setSelectedTreatment('');
      setSelectedDate('');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error('Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedTreatmentDescription = () => {
    const treatment = treatmentOptions.find(t => t.value === selectedTreatment);
    return treatment?.description || '';
  };

  const isDateAvailable = (date: Date) => {
    return !isBefore(date, startOfDay(new Date())) && !isWeekend(date);
  };

  const isTimeSlotAvailable = (time: string) => {
    return !occupiedSlots.includes(time);
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agendar Nueva Cita</h2>
            <p className="text-sm text-gray-600 mt-1">
              Paciente: {patient.nombres} {patient.apellidos} - HC: {patient.numeroHistoria}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Tipo de Tratamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Tipo de Tratamiento *
            </label>
            <select
              {...register('tipo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar tratamiento...</option>
              {treatmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
            )}
            {selectedTreatment && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Descripción:</strong> {getSelectedTreatmentDescription()}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Fecha de la Cita *
              </label>
              <input
                type="date"
                {...register('fechaAgendada')}
                min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                max={format(addDays(new Date(), 60), 'yyyy-MM-dd')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fechaAgendada && (
                <p className="mt-1 text-sm text-red-600">{errors.fechaAgendada.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Solo días laborables (Lunes a Viernes)
              </p>
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Hora de la Cita *
              </label>
              <select
                {...register('hora')}
                disabled={!watchedDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">
                  {!watchedDate ? 'Primero seleccione una fecha' : 'Seleccionar hora...'}
                </option>
                {timeSlots.map((time) => (
                  <option 
                    key={time} 
                    value={time}
                    disabled={!isTimeSlotAvailable(time)}
                  >
                    {time} {!isTimeSlotAvailable(time) ? '(Ocupado)' : ''}
                  </option>
                ))}
              </select>
              {errors.hora && (
                <p className="mt-1 text-sm text-red-600">{errors.hora.message}</p>
              )}
              {watchedDate && occupiedSlots.length > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Horarios ocupados: {occupiedSlots.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pieza Dental */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pieza Dental
              </label>
              <input
                type="text"
                {...register('piezaDental')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 1.6, Incisivo Central"
              />
              <p className="mt-1 text-xs text-gray-500">
                Especificar la pieza dental a tratar (opcional)
              </p>
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (minutos)
              </label>
              <input
                type="number"
                {...register('duracionMinutos')}
                min="15"
                max="240"
                step="15"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.duracionMinutos && (
                <p className="mt-1 text-sm text-red-600">{errors.duracionMinutos.message}</p>
              )}
            </div>
          </div>

          {/* Notas Adicionales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              {...register('descripcion')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones, preparación especial, etc..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Agendando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Agendar Cita</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;