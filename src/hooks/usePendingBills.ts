import { useState, useEffect } from 'react';
import { Treatment, Patient } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface TreatmentWithPatient extends Treatment {
  numeroHistoria?: string;
  nombreCompleto?: string;
}

export const usePendingBills = () => {
  const [bills, setBills] = useState<TreatmentWithPatient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingBills = async () => {
    setLoading(true);
    try {
      // Get completed treatments without boleta code
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
        .eq('estado', 'completado')
        .is('boletacodigo', null);

      if (error) throw error;

      // Transform data to match frontend interface
      const transformedBills = (data || []).map(bill => ({
        id: bill.id,
        pacienteId: bill.pacienteid,
        tipo: bill.tipo,
        descripcion: bill.descripcion,
        fechaAgendada: bill.fechaagendada,
        estado: bill.estado,
        piezaDental: bill.piezadental,
        boletaCodigo: bill.boletacodigo,
        fechaCompletado: bill.fechacompletado,
        costo: bill.costo,
        duracionMinutos: bill.duracionminutos,
        fechaCreacion: bill.fechacreacion,
        fechaActualizacion: bill.fechaactualizacion,
        numeroHistoria: bill.paciente?.numerohistoria,
        nombreCompleto: bill.paciente ? `${bill.paciente.nombres} ${bill.paciente.apellidos}` : 'N/A'
      }));

      setBills(transformedBills);
    } catch (error) {
      console.error('Error fetching pending bills:', error);
      toast.error('Error al cargar las boletas pendientes');
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBill = async (billId: string, boletaCodigo: string) => {
    try {
      const { error } = await supabase
        .from('tratamiento')
        .update({ boletacodigo: boletaCodigo })
        .eq('id', billId);

      if (error) throw error;
      
      // Remove from pending bills list
      setBills(prevBills => prevBills.filter(bill => bill.id !== billId));
      
      toast.success('Boleta registrada exitosamente');
    } catch (error) {
      console.error('Error updating bill:', error);
      toast.error('Error al registrar la boleta');
      throw error;
    }
  };

  useEffect(() => {
    fetchPendingBills();
  }, []);

  return { bills, loading, updateBill };
};