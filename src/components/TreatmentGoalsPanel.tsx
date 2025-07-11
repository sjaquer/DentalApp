import React from 'react';
import { Target, TrendingUp, CheckCircle } from 'lucide-react';
import { useTreatmentGoals } from '../hooks/useTreatmentGoals';
import ProgressBar from './ProgressBar';

const TreatmentGoalsPanel: React.FC = () => {
  const { goals, loading } = useTreatmentGoals();

  const getTreatmentLabel = (tipo: string) => {
    const labels = {
      'profilaxis': 'Profilaxis',
      'restauracion': 'Restauración',
      'corona': 'Corona',
      'puente': 'Puente',
      'blanqueamiento': 'Blanqueamiento',
      'endodoncia': 'Endodoncia',
      'PPR': 'PPR',
      'otro': 'Otros'
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-bold text-gray-900">Objetivos Semestrales</h2>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.tipo} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {getTreatmentLabel(goal.tipo)}
              </span>
              <span className="text-sm text-gray-500">
                {goal.completados}/{goal.metaCantidad}
              </span>
            </div>
            
            <ProgressBar 
              value={goal.completados} 
              max={goal.metaCantidad}
              className="mb-2"
            />
            
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{goal.porcentaje}% completado</span>
              {goal.porcentaje >= 100 && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Progreso General
          </span>
        </div>
        <p className="text-xs text-green-700">
          {goals.filter(g => g.porcentaje >= 100).length} de {goals.length} objetivos completados
        </p>
      </div>
    </div>
  );
};

export default TreatmentGoalsPanel;