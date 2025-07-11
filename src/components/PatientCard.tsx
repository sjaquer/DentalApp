import React from 'react';
import { Patient } from '../types';
import { User, Phone, AlertTriangle, Calendar } from 'lucide-react';
import { calculateAge } from '../utils/dateUtils';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const age = calculateAge(patient.fechaNacimiento);
  const hasAlergias = patient.alergias && patient.alergias.length > 0;
  const hasEnfermedades = patient.enfermedadesSistemicas && patient.enfermedadesSistemicas.length > 0;

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {patient.nombres} {patient.apellidos}
            </h3>
            <p className="text-sm text-gray-500">
              HC: {patient.numeroHistoria}
            </p>
          </div>
        </div>
        {(hasAlergias || hasEnfermedades) && (
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{age} años</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{patient.celular}</span>
        </div>

        {hasAlergias && (
          <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            Alergias: {patient.alergias.join(', ')}
          </div>
        )}
        
        {hasEnfermedades && (
          <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            Enfermedades: {patient.enfermedadesSistemicas.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientCard;