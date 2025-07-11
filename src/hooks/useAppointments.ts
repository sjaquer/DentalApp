import { useState, useEffect } from 'react';
import { Treatment } from '../types';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      // Simular datos de citas
      const now = new Date();
      const mockAppointments: Treatment[] = [
        {
          id: '1',
          pacienteId: '1',
          tipo: 'profilaxis',
          descripcion: 'Limpieza dental',
          fechaAgendada: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
          estado: 'confirmado',
          piezaDental: 'Todos los dientes',
          costo: 150.00,
          duracionMinutos: 45,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          numeroHistoria: 'HC-2024-001'
        },
        {
          id: '2',
          pacienteId: '2',
          tipo: 'restauracion',
          descripcion: 'Restauración molar',
          fechaAgendada: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
          estado: 'pendiente',
          piezaDental: '1.6',
          costo: 200.00,
          duracionMinutos: 60,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          numeroHistoria: 'HC-2024-002'
        },
        {
          id: '3',
          pacienteId: '3',
          tipo: 'endodoncia',
          descripcion: 'Tratamiento de conducto',
          fechaAgendada: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(),
          estado: 'pendiente',
          piezaDental: '2.1',
          costo: 400.00,
          duracionMinutos: 90,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          numeroHistoria: 'HC-2024-003'
        }
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return { appointments, loading };
};