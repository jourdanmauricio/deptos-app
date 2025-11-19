import {
  IconDashboard,
  IconChartBar,
  IconListDetails,
  IconSearch,
  IconHelp,
  IconDatabase,
  IconFileWord,
  IconReport,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

export const menuItems = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Usuarios',
      url: '/dashboard/users',
      icon: IconUsers,
    },
    {
      title: 'Propiedades',
      url: '/dashboard/properties',
      icon: IconChartBar,
    },
    {
      title: 'Terceros',
      url: '/dashboard/parties',
      icon: IconUsers,
    },
    {
      title: 'Alquileres',
      url: '/dashboard/rentals',
      icon: IconListDetails,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Asistente de Word',
      url: '/dashboard/word-assistant',
      icon: IconFileWord,
    },
    {
      name: 'Base de datos',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'Reportes',
      url: '#',
      icon: IconReport,
    },
  ],
};

export const propertyStatus = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  RENTED: 'Alquilado',
};

export const rentalStatus = {
  ACTIVE: 'Alquilado',
  INACTIVE: 'Inactivo',
  EXPIRED: 'Finalizado',
  CANCELLED: 'Cancelado',
};

export const rentalVariables = [
  {
    name: 'propietario_apellidos',
    label: 'Apellidos del propietario',
  },
  {
    name: 'propietario_nombres',
    label: 'Nombres del propietario',
  },
  {
    name: 'propietario_dni',
    label: 'DNI del propietario',
  },
  {
    name: 'propietario_cuil',
    label: 'CUIL del propietario',
  },
  {
    name: 'inquilino_nombres',
    label: 'Nombres del inquilino',
  },
  {
    name: 'inquilino_apellidos',
    label: 'Apellidos del inquilino',
  },
  {
    name: 'inquilino_dni',
    label: 'DNI del inquilino',
  },
  {
    name: 'inquilino_cuil',
    label: 'CUIL del inquilino',
  },
  {
    name: 'propiedad_domicilio',
    label: 'Dirección de la propiedad',
  },
  {
    name: 'plazo_texto',
    label: 'Plazo (texto)',
  },
  {
    name: 'plazo_numero',
    label: 'Plazo (número)',
  },
  {
    name: 'fecha_inicio',
    label: 'Fecha de inicio',
  },
  {
    name: 'primer_ajuste',
    label: 'Primer ajuste',
  },
  {
    name: 'indice',
    label: 'Índice',
  },
  {
    name: 'indice_texto',
    label: 'Índice (texto)',
  },
  {
    name: 'fecha_fin',
    label: 'Fecha de finalización',
  },
  {
    name: 'penalidad',
    label: 'Penalidad',
  },
  {
    name: 'penalidad_entrega_texto',
    label: 'Penalidad de entrega (texto)',
  },
  {
    name: 'penalidad_entrega_numero',
    label: 'Penalidad de entrega (número)',
  },
  {
    name: 'deposito_texto',
    label: 'Depósito (texto)',
  },
  {
    name: 'deposito_numero',
    label: 'Depósito (número)',
  },
  {
    name: 'penalidad_entrega',
    label: 'Penalidad de entrega',
  },
  {
    name: 'garantes_info',
    label: 'Información de garantes',
  },
  {
    name: 'firmas_info',
    label: 'Firmas',
  },
  {
    name: 'fecha_firma',
    label: 'Fecha de firma',
  },
];

export const indexationTypes = [
  { id: 'IPC', description: 'INDICE DE PRECIOS AL CONSUMIDOR' },
  { id: 'ICL', description: 'INDICE PARA CONTRATOS DE LOCACION' },
  { id: 'FIXED', description: 'FIJO' },
];
