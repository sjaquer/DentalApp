import { useState, useEffect } from 'react';
import { Treatment } from '../types';
import toast from 'react-hot-toast';

export const usePendingBills = () => {
  const [bills, setBills] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingBills = async () => {
    try {
      // Simular datos de boletas pendientes
      const mockBills: Treatment[] = [
        {
          id: '1',
          pacienteId: '1',
          tipo: 'profilaxis',
          descripcion: 'Limpieza dental completa',
          fechaAgendada: new Date().toISOString(),
          estado: 'completado',
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
          descripcion: 'Resina en molar',
          fechaAgendada: new Date().toISOString(),
          estado: 'completado',
          piezaDental: '1.6',
          costo: 200.00,
          duracionMinutos: 60,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          numeroHistoria: 'HC-2024-002'
        }
      ];

      setBills(mockBills);
    } catch (error) {
      console.error('Error fetching pending bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBill = async (billId: string, boletaCodigo: string) => {
    try {
      // Simular actualización de boleta
      setBills(prevBills => 
        prevBills.filter(bill => bill.id !== billId)
      );
      
      toast.success('Boleta registrada exitosamente');
    } catch (error) {
      console.error('Error updating bill:', error);
      toast.error('Error al registrar la boleta');
    }
  };

  useEffect(() => {
    fetchPendingBills();
  }, []);

  return { bills, loading, updateBill };
};