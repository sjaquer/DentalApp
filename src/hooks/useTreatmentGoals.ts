import { useState, useEffect } from 'react';
import { TreatmentGoal } from '../types';

export const useTreatmentGoals = () => {
  const [goals, setGoals] = useState<TreatmentGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTreatmentGoals = async () => {
    try {
      // Simular datos de objetivos semestrales
      // En producción, estos datos vendrían del backend
      const mockGoals: TreatmentGoal[] = [
        {
          tipo: 'profilaxis',
          metaCantidad: 50,
          completados: 32,
          porcentaje: 64
        },
        {
          tipo: 'restauracion',
          metaCantidad: 30,
          completados: 28,
          porcentaje: 93
        },
        {
          tipo: 'corona',
          metaCantidad: 15,
          completados: 8,
          porcentaje: 53
        },
        {
          tipo: 'endodoncia',
          metaCantidad: 20,
          completados: 12,
          porcentaje: 60
        },
        {
          tipo: 'blanqueamiento',
          metaCantidad: 25,
          completados: 19,
          porcentaje: 76
        }
      ];

      setGoals(mockGoals);
    } catch (error) {
      console.error('Error fetching treatment goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatmentGoals();
  }, []);

  return { goals, loading };
};