import { useState, useEffect } from 'react';
import { TreatmentGoal } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useTreatmentGoals = () => {
  const [goals, setGoals] = useState<TreatmentGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTreatmentGoals = async () => {
    setLoading(true);
    try {
      // Get completed treatments count by type for current semester
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const semesterStart = currentMonth < 6 ? 
        new Date(currentYear, 0, 1) : 
        new Date(currentYear, 6, 1);
      
      const { data: treatments, error } = await supabase
        .from('tratamiento')
        .select('tipo')
        .eq('estado', 'completado')
        .gte('fechacompletado', semesterStart.toISOString());

      if (error) throw error;

      // Count treatments by type
      const treatmentCounts = (treatments || []).reduce((acc: Record<string, number>, treatment) => {
        acc[treatment.tipo] = (acc[treatment.tipo] || 0) + 1;
        return acc;
      }, {});

      // Define semester goals (these could be stored in database in the future)
      const semesterGoals = {
        'profilaxis': 50,
        'restauracion': 30,
        'corona': 15,
        'puente': 10,
        'blanqueamiento': 25,
        'endodoncia': 20,
        'PPR': 8,
        'otro': 15
      };

      const goals: TreatmentGoal[] = Object.entries(semesterGoals).map(([tipo, metaCantidad]) => {
        const completados = treatmentCounts[tipo] || 0;
        const porcentaje = Math.round((completados / metaCantidad) * 100);
        
        return {
          tipo: tipo as any,
          metaCantidad,
          completados,
          porcentaje
        };
      });

      setGoals(goals);
    } catch (error) {
      console.error('Error fetching treatment goals:', error);
      toast.error('Error al cargar los objetivos');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatmentGoals();
  }, []);

  return { goals, loading };
};