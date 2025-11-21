'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Party } from '@/shared/types/party';
import { $Enums } from '@/lib/generated/prisma/client';

export async function getParties() {
  try {
    const parties = await prisma.party.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return parties;
  } catch (error) {
    console.error('Error fetching parties:', error);
    throw new Error('Error al obtener los terceros');
  }
}

export async function getTenants() {
  try {
    // Tenants con rentals y nombre de la propiedad
    const tenants = await prisma.party.findMany({
      where: { type: 'TENANT' },
      include: {
        tenantRentals: {
          include: {
            property: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tenants;
  } catch (error) {
    console.error('Error fetching tenants:', error);
    throw new Error('Error al obtener los inquilinos');
  }
}

export async function getPartyById(id: string) {
  try {
    const party = await prisma.party.findUnique({
      where: { id },
    });
    return party;
  } catch (error) {
    console.error('Error fetching party:', error);
    throw new Error('Error al obtener el tercero');
  }
}

export async function createParty(data: Omit<Party, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Verificar si ya existe un tercero con el mismo DNI
    const existingPartyByDni = await prisma.party.findFirst({
      where: {
        dni: data.dni,
      },
    });

    if (existingPartyByDni) {
      throw new Error('Ya existe un tercero con el mismo DNI. Por favor, verifique los datos.');
    }

    // Verificar si ya existe un tercero con el mismo email
    const existingPartyByEmail = await prisma.party.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existingPartyByEmail) {
      throw new Error('Ya existe un tercero con el mismo email. Por favor, verifique los datos.');
    }

    // Asegurar que el tipo sea válido usando el enum de Prisma
    const validTypes = Object.values($Enums.PartyType);
    if (!validTypes.includes(data.type as $Enums.PartyType)) {
      throw new Error(
        `Tipo de tercero inválido: ${data.type}. Valores válidos: ${validTypes.join(', ')}`
      );
    }

    const party = await prisma.party.create({
      data: {
        ...data,
        type: data.type as $Enums.PartyType,
      },
    });
    revalidatePath('/dashboard/parties');
    return party;
  } catch (error) {
    console.error('Error creating party:', error);
    // Si el error ya tiene un mensaje personalizado, propagarlo
    if (error instanceof Error && error.message.includes('Ya existe')) {
      throw error;
    }
    throw new Error('Error al crear el tercero');
  }
}

export async function updateParty(
  id: string,
  data: Partial<Omit<Party, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    // Verificar si se está actualizando el DNI y si ya existe otro tercero con el mismo DNI
    if (data.dni) {
      const existingPartyByDni = await prisma.party.findFirst({
        where: {
          dni: data.dni,
          NOT: {
            id: id,
          },
        },
      });

      if (existingPartyByDni) {
        throw new Error('Ya existe otro tercero con el mismo DNI. Por favor, verifique los datos.');
      }
    }

    // Verificar si se está actualizando el email y si ya existe otro tercero con el mismo email
    if (data.email) {
      const existingPartyByEmail = await prisma.party.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: id,
          },
        },
      });

      if (existingPartyByEmail) {
        throw new Error(
          'Ya existe otro tercero con el mismo email. Por favor, verifique los datos.'
        );
      }
    }

    // Validar el tipo si se está actualizando
    if (data.type) {
      const validTypes = Object.values($Enums.PartyType);
      if (!validTypes.includes(data.type as $Enums.PartyType)) {
        throw new Error(
          `Tipo de tercero inválido: ${data.type}. Valores válidos: ${validTypes.join(', ')}`
        );
      }
    }

    const party = await prisma.party.update({
      where: { id },
      data: {
        ...data,
        ...(data.type && { type: data.type as $Enums.PartyType }),
      },
    });
    revalidatePath('/dashboard/parties');
    return party;
  } catch (error) {
    console.error('Error updating party:', error);
    // Si el error ya tiene un mensaje personalizado, propagarlo
    if (error instanceof Error && error.message.includes('Ya existe')) {
      throw error;
    }
    throw new Error('Error al actualizar el tercero');
  }
}

export async function deleteParty(id: string) {
  try {
    await prisma.party.delete({
      where: { id },
    });
    revalidatePath('/dashboard/parties');
    return { success: true };
  } catch (error) {
    console.error('Error deleting party:', error);
    throw new Error('Error al eliminar el tercero');
  }
}
