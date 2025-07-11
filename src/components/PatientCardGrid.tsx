import React from 'react';
import { Patient } from '../types';
import PatientCard from './PatientCard';
import { Users, Loader2 } from 'lucide-react';

interface PatientCardGridProps {
  patients: Patient[];
  loading: boolean;
  onPatientClick: (patient: Patient) => void;
}

const PatientCardGrid: React.FC<PatientCardGridProps> = ({ 
  patients, 
  loading, 
  onPatientClick 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay pacientes registrados
        </h3>
        <p className="text-gray-600">
          Comienza agregando tu primer paciente al sistema
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          onClick={() => onPatientClick(patient)}
        />
      ))}
    </div>
  );
};

export default PatientCardGrid;