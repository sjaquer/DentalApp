import { useState, useEffect } from 'react';
import { Patient } from '../types';
import { supabase } from '../lib/supabase';
import { calculateAge } from '../utils/dateUtils';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('Paciente')
        .select('*')
        .order('fechaCreacion', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        // Datos simulados para demostración
        setPatients([
          {
            id: '1',
            numeroHistoria: 'HC-2024-001',
            nombres: 'María Elena',
            apellidos: 'García López',
            fechaNacimiento: '1985-03-15',
            celular: '+51 987 654 321',
            email: 'maria.garcia@email.com',
            alergias: ['Penicilina'],
            enfermedadesSistemicas: ['Diabetes'],
            religion: 'Católica',
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            edad: calculateAge('1985-03-15')
          },
          {
            id: '2',
            numeroHistoria: 'HC-2024-002',
            nombres: 'Juan Carlos',
            apellidos: 'Rodríguez Pérez',
            fechaNacimiento: '1990-07-22',
            celular: '+51 987 654 322',
            email: 'juan.rodriguez@email.com',
            alergias: [],
            enfermedadesSistemicas: ['Hipertensión'],
            religion: 'Cristiana',
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            edad: calculateAge('1990-07-22')
          },
          {
            id: '3',
            numeroHistoria: 'HC-2024-003',
            nombres: 'Ana Isabel',
            apellidos: 'Mendoza Silva',
            fechaNacimiento: '1978-12-08',
            celular: '+51 987 654 323',
            email: 'ana.mendoza@email.com',
            alergias: ['Látex', 'Ibuprofeno'],
            enfermedadesSistemicas: [],
            religion: 'Católica',
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            edad: calculateAge('1978-12-08')
          }
        ]);
        return;
      }

      const patientsWithAge = data.map(patient => ({
        ...patient,
        edad: calculateAge(patient.fechaNacimiento)
      }));
      
      setPatients(patientsWithAge);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const refreshPatients = () => {
    fetchPatients();
  };

  return { patients, loading, refreshPatients };
};