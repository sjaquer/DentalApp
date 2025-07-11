import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import PatientCardGrid from './components/PatientCardGrid';
import TreatmentGoalsPanel from './components/TreatmentGoalsPanel';
import FinancialAndCalendarPanel from './components/FinancialAndCalendarPanel';
import PatientModal from './components/PatientModal';
import { Patient } from './types';
import { supabase } from './lib/supabase';
import { usePatients } from './hooks/usePatients';

function App() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const { patients, loading, refreshPatients } = usePatients();

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsNewPatient(false);
    setIsPatientModalOpen(true);
  };

  const handleNewPatient = () => {
    setSelectedPatient(null);
    setIsNewPatient(true);
    setIsPatientModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPatientModalOpen(false);
    setSelectedPatient(null);
    setIsNewPatient(false);
  };

  const handleSavePatient = () => {
    refreshPatients();
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <Header onNewPatient={handleNewPatient} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Panel Superior - Historias Clínicas */}
          <div className="xl:col-span-12 order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Historias Clínicas</h2>
                <span className="text-sm text-gray-500">
                  {patients.length} pacientes registrados
                </span>
              </div>
              <PatientCardGrid 
                patients={patients}
                loading={loading}
                onPatientClick={handlePatientClick}
              />
            </div>
          </div>

          {/* Panel Izquierdo - Objetivos Semestrales */}
          <div className="xl:col-span-3 order-2 xl:order-2">
            <TreatmentGoalsPanel />
          </div>

          {/* Panel Derecho - Boletas y Calendario */}
          <div className="xl:col-span-9 order-3 xl:order-3">
            <FinancialAndCalendarPanel />
          </div>
        </div>
      </main>

      {/* Modal de Paciente */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={handleCloseModal}
        patient={selectedPatient}
        isNewPatient={isNewPatient}
        onSave={handleSavePatient}
      />
    </div>
  );
}

export default App;