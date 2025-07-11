import { useState, useEffect } from 'react';
import { Patient } from '../types';
import { supabase } from '../lib/supabase';
import { calculateAge } from '../utils/dateUtils';
import toast from 'react-hot-toast';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('paciente')
        .select('*')
        .order('fechacreacion', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform database fields to match frontend interface
      const patientsWithAge = (data || []).map(patient => ({
        id: patient.id,
        numeroHistoria: patient.numerohistoria,
        nombres: patient.nombres,
        apellidos: patient.apellidos,
        fechaNacimiento: patient.fechanacimiento,
        celular: patient.celular,
        email: patient.email,
        alergias: patient.alergias || [],
        enfermedadesSistemicas: patient.enfermedadessistemicas || [],
        religion: patient.religion,
        fechaCreacion: patient.fechacreacion,
        fechaActualizacion: patient.fechaactualizacion,
        edad: calculateAge(patient.fechanacimiento)
      }));
      
      setPatients(patientsWithAge);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Error al cargar los pacientes');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patientData: Omit<Patient, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'edad'>) => {
    try {
      const { data, error } = await supabase
        .from('paciente')
        .insert([{
          numerohistoria: patientData.numeroHistoria,
          nombres: patientData.nombres,
          apellidos: patientData.apellidos,
          fechanacimiento: patientData.fechaNacimiento,
          celular: patientData.celular,
          email: patientData.email || null,
          alergias: patientData.alergias || [],
          enfermedadessistemicas: patientData.enfermedadesSistemicas || [],
          religion: patientData.religion || null
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchPatients(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  };

  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    try {
      const updateData: any = {};
      
      if (patientData.numeroHistoria) updateData.numerohistoria = patientData.numeroHistoria;
      if (patientData.nombres) updateData.nombres = patientData.nombres;
      if (patientData.apellidos) updateData.apellidos = patientData.apellidos;
      if (patientData.fechaNacimiento) updateData.fechanacimiento = patientData.fechaNacimiento;
      if (patientData.celular) updateData.celular = patientData.celular;
      if (patientData.email !== undefined) updateData.email = patientData.email;
      if (patientData.alergias !== undefined) updateData.alergias = patientData.alergias;
      if (patientData.enfermedadesSistemicas !== undefined) updateData.enfermedadessistemicas = patientData.enfermedadesSistemicas;
      if (patientData.religion !== undefined) updateData.religion = patientData.religion;

      const { data, error } = await supabase
        .from('paciente')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchPatients(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const refreshPatients = () => {
    fetchPatients();
  };

  return { 
    patients, 
    loading, 
    refreshPatients, 
    createPatient, 
    updatePatient 
  };
};