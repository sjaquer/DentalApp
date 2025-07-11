import { useState, useEffect } from 'react';
import { Treatment } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface TreatmentWithPatient extends Treatment {
  numeroHistoria?: string;
  nombreCompleto?: string;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<TreatmentWithPatient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Get scheduled appointments (pending, confirmed, or completed in the future)
      const { data, error } = await supabase
        .from('tratamiento')
        .select(`
          *,
          paciente:pacienteid (
            numerohistoria,
            nombres,
            apellidos
          )
        `)
        .in('estado', ['pendiente', 'confirmado', 'completado'])
        .order('fechaagendada', { ascending: true });

      if (error) throw error;

      // Transform data to match frontend interface
      const transformedAppointments = (data || []).map(appointment => ({
        id: appointment.id,
        pacienteId: appointment.pacienteid,
        tipo: appointment.tipo,
        descripcion: appointment.descripcion,
        fechaAgendada: appointment.fechaagendada,
        estado: appointment.estado,
        piezaDental: appointment.piezadental,
        boletaCodigo: appointment.boletacodigo,
        fechaCompletado: appointment.fechacompletado,
        costo: appointment.costo,
        duracionMinutos: appointment.duracionminutos,
        fechaCreacion: appointment.fechacreacion,
        fechaActualizacion: appointment.fechaactualizacion,
        numeroHistoria: appointment.paciente?.numerohistoria,
        nombreCompleto: appointment.paciente ? `${appointment.paciente.nombres} ${appointment.paciente.apellidos}` : 'N/A'
      }));

      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Error al cargar las citas');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const updateData: any = { estado: newStatus };
      
      // If marking as completed, set completion date
      if (newStatus === 'completado') {
        updateData.fechacompletado = new Date().toISOString();
      }

      const { error } = await supabase
        .from('tratamiento')
        .update(updateData)
        .eq('id', appointmentId);

      if (error) throw error;
      
      await fetchAppointments(); // Refresh the list
      toast.success('Estado de cita actualizado');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Error al actualizar el estado de la cita');
      throw error;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return { 
    appointments, 
    loading, 
    refreshAppointments: fetchAppointments,
    updateAppointmentStatus 
  };
};