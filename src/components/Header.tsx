import React from 'react';
import { Plus, Activity, Users, Calendar, BarChart3 } from 'lucide-react';

interface HeaderProps {
  onNewPatient: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewPatient }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DentalCare Pro</h1>
                <p className="text-sm text-gray-600">Sistema de Gestión Integral</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Pacientes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Citas</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Reportes</span>
              </div>
            </div>
            
            <button
              onClick={onNewPatient}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Paciente</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;