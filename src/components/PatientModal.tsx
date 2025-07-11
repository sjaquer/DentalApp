import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, Mail, Calendar, AlertTriangle, Heart, CalendarPlus } from 'lucide-react';
import { Patient } from '../types';
import { usePatients } from '../hooks/usePatients';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import AppointmentModal from './AppointmentModal';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient | null;
  isNewPatient: boolean;
  onSave: () => void;
}

const schema = yup.object({
  numeroHistoria: yup.string().required('Número de historia es requerido'),
  nombres: yup.string().required('Nombres son requeridos'),
  apellidos: yup.string().required('Apellidos son requeridos'),
  fechaNacimiento: yup.string().required('Fecha de nacimiento es requerida'),
  celular: yup.string().required('Número de celular es requerido'),
  email: yup.string().email('Email inválido').nullable(),
  alergias: yup.string(),
  enfermedadesSistemicas: yup.string(),
  religion: yup.string()
});

const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  isNewPatient,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const { createPatient, updatePatient } = usePatients();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (isOpen) {
      if (patient && !isNewPatient) {
        // Llenar formulario con datos del paciente
        setValue('numeroHistoria', patient.numeroHistoria);
        setValue('nombres', patient.nombres);
        setValue('apellidos', patient.apellidos);
        setValue('fechaNacimiento', patient.fechaNacimiento);
        setValue('celular', patient.celular);
        setValue('email', patient.email || '');
        setValue('alergias', patient.alergias?.join(', ') || '');
        setValue('enfermedadesSistemicas', patient.enfermedadesSistemicas?.join(', ') || '');
        setValue('religion', patient.religion || '');
      } else {
        // Limpiar formulario para nuevo paciente
        reset();
      }
    }
  }, [isOpen, patient, isNewPatient, setValue, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const patientData = {
        numeroHistoria: data.numeroHistoria,
        nombres: data.nombres,
        apellidos: data.apellidos,
        fechaNacimiento: data.fechaNacimiento,
        celular: data.celular,
        email: data.email || null,
        alergias: data.alergias ? data.alergias.split(',').map((item: string) => item.trim()) : [],
        enfermedadesSistemicas: data.enfermedadesSistemicas ? data.enfermedadesSistemicas.split(',').map((item: string) => item.trim()) : [],
        religion: data.religion || null
      };

      if (isNewPatient) {
        await createPatient(patientData);
        toast.success('Paciente creado exitosamente');
      } else {
        if (!patient?.id) throw new Error('ID de paciente no encontrado');
        await updatePatient(patient.id, patientData);
        toast.success('Paciente actualizado exitosamente');
      }

      onSave();
    } catch (error) {
      console.error('Error saving patient:', error);
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          toast.error('Ya existe un paciente con ese número de historia o celular');
        } else {
          toast.error('Error al guardar el paciente: ' + error.message);
        }
      } else {
        toast.error('Error al guardar el paciente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleAppointment = () => {
    if (!patient || isNewPatient) {
      toast.error('Debe guardar el paciente antes de agendar una cita');
      return;
    }
    setIsAppointmentModalOpen(true);
  };

  const handleAppointmentSaved = () => {
    setIsAppointmentModalOpen(false);
    toast.success('Cita agendada exitosamente');
    onSave(); // Refresh parent data
  };
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {isNewPatient ? 'Nuevo Paciente' : 'Editar Paciente'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                  <User className="w-5 h-5" />
                  <span>Información Básica</span>
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Historia *
                  </label>
                  <input
                    type="text"
                    {...register('numeroHistoria')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: HC-2024-001"
                  />
                  {errors.numeroHistoria && (
                    <p className="mt-1 text-sm text-red-600">{errors.numeroHistoria.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    {...register('nombres')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.nombres && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombres.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    {...register('apellidos')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.apellidos && (
                    <p className="mt-1 text-sm text-red-600">{errors.apellidos.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    {...register('fechaNacimiento')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fechaNacimiento && (
                    <p className="mt-1 text-sm text-red-600">{errors.fechaNacimiento.message}</p>
                  )}
                </div>
              </div>

              {/* Contacto e Información Médica */}
              <div className="space-y-4">
                <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                  <Phone className="w-5 h-5" />
                  <span>Contacto</span>
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Celular *
                  </label>
                  <input
                    type="tel"
                    {...register('celular')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+51 987 654 321"
                  />
                  {errors.celular && (
                    <p className="mt-1 text-sm text-red-600">{errors.celular.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religión
                  </label>
                  <input
                    type="text"
                    {...register('religion')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Información Médica */}
            <div className="space-y-4">
              <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <Heart className="w-5 h-5" />
                <span>Información Médica</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alergias
                </label>
                <textarea
                  {...register('alergias')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Separar por comas: Penicilina, Látex, ..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separar múltiples alergias con comas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enfermedades Sistémicas
                </label>
                <textarea
                  {...register('enfermedadesSistemicas')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Separar por comas: Diabetes, Hipertensión, ..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separar múltiples enfermedades con comas
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </>
                )}
              </button>
              {!isNewPatient && patient && (
                <button
                  type="button"
                  onClick={handleScheduleAppointment}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Agendar Cita</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Agendamiento */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        patient={patient}
        onSave={handleAppointmentSaved}
      />
    </>
  );
};

export default PatientModal;