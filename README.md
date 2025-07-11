# DentalCare Pro - Sistema de Gestión de Clínica Dental

Una aplicación web integral para la gestión de clínicas dentales con funcionalidades avanzadas de IA para predicción de inventario y comunicación automatizada con pacientes.

## 🚀 Características Principales

### Frontend (React + TypeScript)
- **Dashboard Modular**: Tres paneles principales con información crítica
- **Gestión de Pacientes**: Historias clínicas completas con información médica
- **Calendario Interactivo**: Visualización de citas con FullCalendar
- **Objetivos Semestrales**: Seguimiento de metas por tipo de tratamiento
- **Gestión de Boletas**: Control de pagos pendientes
- **Diseño Responsivo**: Mobile-first con Tailwind CSS

### Backend (Preparado para Integración)
- **IA Predictiva**: Predicción de consumo de materiales dentales
- **Bot de WhatsApp**: Comunicación automatizada con pacientes
- **API RESTful**: Endpoints para todas las funcionalidades
- **Base de Datos**: PostgreSQL con Supabase

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18 con TypeScript
- Tailwind CSS para estilos
- FullCalendar para el calendario
- React Hook Form para formularios
- Lucide React para iconos
- React Hot Toast para notificaciones

### Base de Datos
- Supabase (PostgreSQL)
- Estructura optimizada para IA
- Row Level Security (RLS)

### Preparado para Backend
- FastAPI (Python) o Express.js (Node.js)
- OpenAI API para IA generativa
- WhatsApp Business API
- Redis para scheduler

## 📋 Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- Cuenta en Supabase
- Git

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd dental-clinic-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

### Configuración de Supabase

1. **Crear proyecto en Supabase**
   - Ve a https://supabase.com
   - Crea un nuevo proyecto
   - Obtén la URL y clave anónima

2. **Configurar base de datos**
   - Ejecuta los scripts SQL del directorio `/database`
   - Configura las políticas RLS

3. **Variables de entorno**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## 🗄️ Estructura de la Base de Datos

### Tablas Principales
- **Paciente**: Información personal y médica
- **Tratamiento**: Citas y procedimientos
- **Inventario**: Materiales dentales (para IA predictiva)
- **MensajeWhatsApp**: Auditoría de comunicaciones

### Campos Optimizados para IA
- Historial de consumo mensual
- Datos de duración de tratamientos
- Patrones de comunicación con pacientes

## 🤖 Funcionalidades de IA

### IA Predictiva - Inventario
- Predicción de consumo de materiales
- Alertas de stock bajo
- Optimización de compras
- Métricas de gasto estimado

### IA Generativa - WhatsApp
- Recordatorios automáticos de citas
- Respuestas inteligentes a pacientes
- Clasificación de intenciones
- Gestión de reprogramaciones

## 📱 Interfaz de Usuario

### Panel de Historias Clínicas
- Grid responsivo de pacientes
- Búsqueda y filtros avanzados
- Información médica destacada
- Alertas visuales para alergias

### Panel de Objetivos
- Métricas visuales por tratamiento
- Barras de progreso animadas
- Seguimiento semestral
- Indicadores de cumplimiento

### Panel de Calendario y Boletas
- Calendario interactivo con estados
- Gestión de citas pendientes
- Control de pagos
- Notificaciones de vencimiento

## 🔐 Seguridad

### Autenticación
- JWT tokens para API
- Row Level Security en Supabase
- Validación de entrada estricta

### Protección de Datos
- Cifrado en tránsito y reposo
- Auditoría de accesos
- Backup automático

## 📊 Métricas y Reportes

### Dashboard Analítico
- KPIs de tratamientos
- Métricas de satisfacción
- Análisis de inventario
- Reportes financieros

### Exportación de Datos
- Formatos CSV/Excel
- Reportes PDF
- Integración con herramientas BI

## 🚀 Despliegue

### Ambiente de Producción
- **Frontend**: Vercel o Netlify
- **Backend**: Render o Railway
- **Base de Datos**: Supabase (gestionado)
- **Scheduler**: Redis Cloud

### CI/CD
- GitHub Actions para deployment
- Tests automatizados
- Monitoreo de performance

## 📞 Integración WhatsApp

### Configuración del Bot
1. Registrar WhatsApp Business API
2. Configurar webhooks
3. Integrar con OpenAI API
4. Configurar plantillas de mensajes

### Flujos Automatizados
- Recordatorios de citas
- Confirmaciones de asistencia
- Reagendamiento inteligente
- Seguimiento post-tratamiento

## 🔧 Desarrollo

### Estructura del Proyecto
```
src/
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── types/              # Definiciones TypeScript
├── utils/              # Utilidades
├── lib/                # Configuraciones
└── styles/             # Estilos globales
```

### Comandos Útiles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

## 📚 Documentación API

### Endpoints Principales
- `GET /api/pacientes` - Listar pacientes
- `POST /api/pacientes` - Crear paciente
- `GET /api/tratamientos` - Listar tratamientos
- `POST /api/tratamientos` - Agendar tratamiento
- `GET /api/inventario/prediccion` - Predicción IA

### Modelos de Datos
Ver archivo `src/types/index.ts` para definiciones completas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- Email: support@dentalcarepro.com
- Documentación: https://docs.dentalcarepro.com
- Issues: GitHub Issues

---

**DentalCare Pro** - Transformando la gestión dental con tecnología avanzada y IA.