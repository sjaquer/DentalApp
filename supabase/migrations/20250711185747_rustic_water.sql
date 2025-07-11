/*
  # Seed Sample Data for Dental Clinic Management

  1. Sample Data
    - Sample patients with realistic medical information
    - Sample treatments with different states and types
    - Sample inventory items for AI prediction testing
    - Sample WhatsApp messages for audit trail

  2. Data Features
    - Realistic patient demographics and medical history
    - Various treatment types and states for testing
    - Historical consumption data for AI training
    - Message audit trail examples
*/

-- Insertar pacientes de ejemplo
INSERT INTO Paciente (numeroHistoria, nombres, apellidos, fechaNacimiento, celular, email, alergias, enfermedadesSistemicas, religion) VALUES
('HC-2024-001', 'María Elena', 'García López', '1985-03-15', '+51987654321', 'maria.garcia@email.com', '{"Penicilina"}', '{"Diabetes"}', 'Católica'),
('HC-2024-002', 'Juan Carlos', 'Rodríguez Pérez', '1990-07-22', '+51987654322', 'juan.rodriguez@email.com', '{}', '{"Hipertensión"}', 'Cristiana'),
('HC-2024-003', 'Ana Isabel', 'Mendoza Silva', '1978-12-08', '+51987654323', 'ana.mendoza@email.com', '{"Látex", "Ibuprofeno"}', '{}', 'Católica'),
('HC-2024-004', 'Carlos Alberto', 'Vásquez Torres', '1992-11-30', '+51987654324', 'carlos.vasquez@email.com', '{}', '{}', 'Evangélica'),
('HC-2024-005', 'Lucía Fernanda', 'Morales Díaz', '1987-05-18', '+51987654325', 'lucia.morales@email.com', '{"Aspirina"}', '{"Asma"}', 'Católica'),
('HC-2024-006', 'Roberto Miguel', 'Herrera Castro', '1983-09-12', '+51987654326', 'roberto.herrera@email.com', '{}', '{"Diabetes", "Hipertensión"}', 'Cristiana');

-- Insertar tratamientos de ejemplo
INSERT INTO Tratamiento (pacienteId, tipo, descripcion, fechaAgendada, estado, piezaDental, costo, duracionMinutos) VALUES
-- Tratamientos completados (para mostrar en objetivos)
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-001'), 'profilaxis', 'Limpieza dental completa', '2024-01-15 09:00:00+00', 'completado', NULL, 80.00, 45),
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-002'), 'restauracion', 'Restauración con resina compuesta', '2024-01-18 14:30:00+00', 'completado', '1.6', 120.00, 60),
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-003'), 'corona', 'Corona de porcelana', '2024-01-22 10:00:00+00', 'completado', '2.4', 350.00, 90),
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-004'), 'blanqueamiento', 'Blanqueamiento dental', '2024-01-25 16:00:00+00', 'completado', NULL, 200.00, 75),
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-001'), 'endodoncia', 'Tratamiento de conducto', '2024-02-01 09:30:00+00', 'completado', '3.7', 280.00, 120),

-- Tratamientos pendientes (para calendario)
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-005'), 'profilaxis', 'Limpieza dental y revisión', '2024-12-28 10:00:00+00', 'confirmado', NULL, 80.00, NULL),
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-006'), 'restauracion', 'Restauración molar inferior', '2024-12-30 14:00:00+00', 'pendiente', '4.6', 120.00, NULL),
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-002'), 'corona', 'Corona cerámica premolar', '2025-01-03 09:00:00+00', 'pendiente', '1.5', 350.00, NULL),
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-003'), 'profilaxis', 'Control y limpieza', '2025-01-05 11:30:00+00', 'pendiente', NULL, 80.00, NULL),
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-004'), 'puente', 'Puente fijo 3 piezas', '2025-01-08 15:00:00+00', 'pendiente', '2.4-2.6', 750.00, NULL);

-- Actualizar algunos tratamientos completados con fechaCompletado
UPDATE Tratamiento 
SET fechaCompletado = fechaAgendada + INTERVAL '1 hour'
WHERE estado = 'completado';

-- Insertar materiales de inventario de ejemplo (para IA predictiva)
INSERT INTO Inventario (nombreMaterial, cantidadActual, unidadMedida, fechaVencimiento, consumoMensualHistorico, umbralAlertaBajo) VALUES
('Anestesia Local Lidocaína 2%', 25, 'cartuchos', '2025-06-30', '[8, 12, 10, 15, 9, 11]', 10),
('Resina Compuesta Universal', 8, 'jeringas', '2025-12-31', '[3, 4, 2, 5, 3, 4]', 5),
('Amalgama Dental', 15, 'cápsulas', '2026-03-15', '[2, 1, 3, 2, 1, 2]', 8),
('Cemento Temporal', 12, 'tubos', '2025-08-20', '[1, 2, 1, 1, 2, 1]', 5),
('Hilo Retractor Gingival', 20, 'metros', '2026-01-10', '[5, 7, 6, 8, 5, 6]', 10),
('Ácido Grabador 37%', 6, 'jeringas', '2025-04-25', '[2, 3, 2, 2, 3, 2]', 3),
('Adhesivo Dental Universal', 10, 'frascos', '2025-09-18', '[1, 2, 1, 2, 1, 1]', 4),
('Pasta Profiláctica', 18, 'tubos', '2025-11-30', '[4, 5, 3, 6, 4, 5]', 8);

-- Insertar mensajes de WhatsApp de ejemplo (para auditoría del bot)
INSERT INTO MensajeWhatsApp (pacienteId, tratamientoId, tipoMensaje, contenidoEnviado, fechaEnvio, estadoEnvio) VALUES
((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-005'), 
 (SELECT id FROM Tratamiento WHERE pacienteId = (SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-005') AND estado = 'confirmado'), 
 'recordatorio', 
 'Hola Lucía, te recordamos tu cita de limpieza dental mañana 28/12 a las 10:00 AM. ¿Podrías confirmar tu asistencia? Responde SÍ para confirmar.', 
 '2024-12-27 18:00:00+00', 
 'enviado'),

((SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-006'), 
 (SELECT id FROM Tratamiento WHERE pacienteId = (SELECT id FROM Paciente WHERE numeroHistoria = 'HC-2024-006') AND estado = 'pendiente'), 
 'recordatorio', 
 'Estimado Roberto, tienes programada una cita para restauración dental el 30/12 a las 2:00 PM. Por favor confirma tu asistencia respondiendo SÍ.', 
 '2024-12-29 17:00:00+00', 
 'enviado');