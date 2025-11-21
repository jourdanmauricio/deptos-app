# 🏢 Sistema de Gestión de Alquileres de Propiedades

Una aplicación web moderna y completa para la gestión integral de propiedades en alquiler, contratos, pagos y documentación.

## 📋 Descripción

Este sistema está diseñado para administradores y gestores de propiedades inmobiliarias que necesitan una solución centralizada para:

- 🏠 Gestionar un portafolio de propiedades
- 👥 Administrar inquilinos, garantes y propietarios
- 📝 Crear y gestionar contratos de alquiler
- 💰 Llevar control detallado de pagos y vencimientos
- 📄 Generar documentos y contratos en formato Word
- 📊 Visualizar estadísticas y métricas del negocio

## ✨ Características Principales

### Gestión de Propiedades
- Registro completo de propiedades con información detallada
- Control de servicios (gas, electricidad, agua, etc.)
- Estados: Activa, Inactiva, Alquilada
- Características: dormitorios, baños, piscina, garaje, jardín, cocina
- Historial de alquileres por propiedad

### Gestión de Participantes (Parties)
- Registro de inquilinos, garantes y propietarios
- Información completa: DNI, CUIL, teléfono, email, dirección
- Datos laborales y bancarios
- Carga de documentos (frente y dorso de DNI)

### Gestión de Contratos de Alquiler
- Creación de contratos con duración personalizable
- Tipos de indexación: IPC, ICL, o monto fijo
- Configuración de penalidades y rescisión
- Estados: Activo, Inactivo, Vencido, Cancelado
- Vinculación de propiedades, inquilinos, garantes y propietarios
- Generación automática de contratos en formato Word

### Control de Pagos
- Registro detallado de pagos de alquiler
- Conceptos: Alquiler, Expensas, Expensas extraordinarias, Depósito, Otros
- Estados: Pendiente, Pagado, Pagado con atraso, Cancelado
- Múltiples métodos de pago: Efectivo, Cheque, Transferencia, Tarjeta, etc.
- Carga de comprobantes
- Cálculo automático de multas por atraso
- Filtros y búsqueda avanzada

### Asistente de Documentos Word
- Plantillas personalizables para diferentes tipos de documentos
- Variables dinámicas que se reemplazan automáticamente
- Tipos de plantillas: Contratos habitacionales, comerciales, recibos, rescisiones
- Generación de documentos en formato DOCX

### Dashboard y Reportes
- Visualización de métricas clave
- Gráficos interactivos
- Resumen de propiedades y alquileres activos
- Estado de pagos y vencimientos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework de React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **TailwindCSS 4** - Estilos utilitarios
- **shadcn/ui** - Componentes de UI modernos
- **Radix UI** - Primitivos de UI accesibles

### Backend y Base de Datos
- **Prisma** - ORM para gestión de base de datos
- **SQLite** - Base de datos (configurable a PostgreSQL, MySQL, etc.)
- **NextAuth.js** - Autenticación y autorización
- **Turso (LibSQL)** - Soporte para base de datos en la nube

### Librerías Destacadas
- **TanStack Table** - Tablas avanzadas con filtros y ordenamiento
- **TanStack Query** - Gestión de estado del servidor
- **React Hook Form** - Formularios con validación
- **Zod** - Validación de esquemas
- **Tiptap** - Editor de texto enriquecido
- **html-to-docx** - Generación de documentos Word
- **Recharts** - Gráficos y visualizaciones
- **date-fns** - Manipulación de fechas
- **Cloudinary** - Gestión de imágenes

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ 
- npm o pnpm

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd front
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"

# Cloudinary (opcional, para carga de imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="tu-upload-preset"
```

4. **Configurar la base de datos**
```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Poblar la base de datos con datos de prueba
npx prisma db seed
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm start            # Inicia el servidor de producción

# Calidad de código
npm run lint         # Ejecuta el linter

# Base de datos
npx prisma studio    # Abre el editor visual de Prisma
npx prisma migrate dev # Crea y aplica migraciones
npx prisma generate  # Genera el cliente de Prisma
```

## 🗂️ Estructura del Proyecto

```
front/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # Páginas del dashboard
│   └── page.tsx           # Página principal
├── components/            # Componentes de React
│   ├── dashboardPage/     # Dashboard
│   ├── partiesPage/       # Gestión de participantes
│   ├── paymentsPage/      # Gestión de pagos
│   ├── propertiesPage/    # Gestión de propiedades
│   ├── rentalsPage/       # Gestión de alquileres
│   ├── wordAssistantPage/ # Asistente de documentos
│   └── ui/                # Componentes de UI reutilizables
├── lib/                   # Lógica de negocio
│   ├── actions/           # Server Actions
│   └── utils/             # Utilidades
├── hooks/                 # Custom React Hooks
├── prisma/                # Configuración de Prisma
│   ├── schema.prisma      # Esquema de base de datos
│   └── migrations/        # Migraciones
├── shared/                # Código compartido
│   ├── constants/         # Constantes
│   ├── schemas/           # Esquemas de validación
│   └── types/             # Definiciones de tipos
└── public/                # Archivos estáticos
```

## 🔐 Autenticación

El sistema utiliza **NextAuth.js** con autenticación basada en credenciales. Los roles disponibles son:

- **ADMIN**: Acceso completo al sistema
- **USER**: Acceso limitado (configurable)

## 🗄️ Modelo de Datos

### Entidades Principales

- **User**: Usuarios del sistema
- **Property**: Propiedades inmobiliarias
- **Party**: Participantes (inquilinos, garantes, propietarios)
- **Rental**: Contratos de alquiler
- **Payment**: Pagos de alquileres
- **WordTemplate**: Plantillas de documentos

Ver el archivo `prisma/schema.prisma` para más detalles del esquema de base de datos.

## 🎨 Temas

La aplicación soporta múltiples temas:
- Claro / Oscuro
- Temas personalizados (rojo, naranja, verde, azul, amarillo, violeta)

## 📱 Características de UI/UX

- ✅ Diseño responsive (mobile-first)
- ✅ Interfaz moderna y limpia
- ✅ Componentes accesibles (ARIA)
- ✅ Tablas con filtros, ordenamiento y paginación
- ✅ Formularios con validación en tiempo real
- ✅ Carga de imágenes con previsualización
- ✅ Editor de texto enriquecido
- ✅ Notificaciones toast
- ✅ Diálogos de confirmación
- ✅ Skeleton loaders

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 👨‍💻 Autor

Mauricio

## 📞 Soporte

Para soporte o consultas, por favor contacta al equipo de desarrollo.

---

Desarrollado con ❤️ para la gestión eficiente de propiedades en alquiler.
