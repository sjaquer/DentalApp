import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAppointments } from '../hooks/useAppointments';
import { Treatment } from '../types';

const AppointmentCalendar: React.FC = () => {
  const { appointments, loading } = useAppointments();
  const [selectedEvent, setSelectedEvent] = useState<Treatment | null>(null);

  const formatEvents = () => {
    return appointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.tipo} - ${appointment.numeroHistoria || 'N/A'}`,
      start: appointment.fechaAgendada,
      backgroundColor: getEventColor(appointment.estado),
      borderColor: getEventColor(appointment.estado),
      extendedProps: {
        treatment: appointment
      }
    }));
  };

  const getEventColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return '#f59e0b'; // yellow
      case 'confirmado':
        return '#10b981'; // green
      case 'completado':
        return '#6b7280'; // gray
      case 'cancelado':
        return '#ef4444'; // red
      case 'pospuesto':
        return '#8b5cf6'; // purple
      default:
        return '#3b82f6'; // blue
    }
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event.extendedProps.treatment);
  };

  const handleDateClick = (dateInfo: any) => {
    console.log('Date clicked:', dateInfo.dateStr);
    // Aquí se podría abrir un modal para crear una nueva cita
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Pendiente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Confirmado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Completado</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {appointments.length} citas programadas
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={formatEvents()}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          locale="es"
          firstDay={1}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día'
          }}
        />
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Detalles de la Cita</h3>
            <div className="space-y-3">
              <div>
                <strong>Tipo:</strong> {selectedEvent.tipo}
              </div>
              <div>
                <strong>Paciente:</strong> {selectedEvent.numeroHistoria || 'N/A'}
              </div>
              <div>
                <strong>Fecha:</strong> {new Date(selectedEvent.fechaAgendada).toLocaleString()}
              </div>
              <div>
                <strong>Estado:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedEvent.estado === 'confirmado' ? 'bg-green-100 text-green-800' :
                  selectedEvent.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  selectedEvent.estado === 'completado' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedEvent.estado}
                </span>
              </div>
              {selectedEvent.piezaDental && (
                <div>
                  <strong>Pieza Dental:</strong> {selectedEvent.piezaDental}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;