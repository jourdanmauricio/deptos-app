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
