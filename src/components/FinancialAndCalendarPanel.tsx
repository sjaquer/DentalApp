import React from 'react';
import { CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import PendingBillsList from './PendingBillsList';
import AppointmentCalendar from './AppointmentCalendar';

const FinancialAndCalendarPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Boletas Pendientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Boletas Pendientes</h2>
        </div>
        <PendingBillsList />
      </div>

      {/* Calendario de Citas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <CalendarIcon className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Calendario de Citas</h2>
        </div>
        <AppointmentCalendar />
      </div>
    </div>
  );
};

export default FinancialAndCalendarPanel;