import { User as PrismaUser, UserDetails as PrismaUserDetails } from '@/lib/generated/prisma';

// Tipos base de Prisma
export type User = PrismaUser & {
  userDetails: PrismaUserDetails | null;
};
export type UserDetails = PrismaUserDetails;

// Tipo para crear un nuevo usuario (omite id, timestamps y userDetails que se generan automáticamente)
export type CreateUserInput = Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt' | 'password'> & {
  password?: string;
  phone?: string;
  address?: string;
  cbu?: string;
  alias?: string;
  bank?: string;
  bankAccountNumber?: string;
  avatar?: string;
};

// Tipo para crear detalles de usuario (omite id y timestamps que se generan automáticamente)
export type CreateUserDetailsInput = Omit<PrismaUserDetails, 'id' | 'createdAt' | 'updatedAt'>;

// Tipo para actualizar usuario (todos los campos opcionales)
export type UpdateUserInput = Partial<
  Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt'> & {
    phone?: string;
    address?: string;
    cbu?: string;
    alias?: string;
    bank?: string;
    bankAccountNumber?: string;
    avatar?: string;
  }
>;
