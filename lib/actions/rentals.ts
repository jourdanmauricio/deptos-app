'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Rental as PrismaRental } from '@/lib/generated/prisma';

export async function getRentals() {
  try {
    const rentals = await prisma.rental.findMany({
      include: {
        property: true,
        tenant: true,
        owner: true,
        guarantors: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return rentals;
  } catch (error) {
    console.error('Error fetching rentals:', error);
    throw new Error('Error al obtener las rentas');
  }
}

export async function getRentalById(id: string) {
  try {
    const rental = await prisma.rental.findUnique({
      where: { id },
      include: {
        property: true,
        tenant: true,
        owner: true,
        guarantors: true,
      },
    });
    return rental;
  } catch (error) {
    console.error('Error fetching rental:', error);
    throw new Error('Error al obtener la renta');
  }
}

export async function createRental(data: Omit<PrismaRental, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const rental = await prisma.rental.create({
      data,
    });
    revalidatePath('/dashboard/rentals');
    return rental;
  } catch (error) {
    console.error('Error creating rental:', error);
    throw new Error('Error al crear la renta');
  }
}

export async function updateRental(
  id: string,
  data: Partial<Omit<PrismaRental, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    const rental = await prisma.rental.update({
      where: { id },
      data,
    });
    revalidatePath('/dashboard/rentals');
    return rental;
  } catch (error) {
    console.error('Error updating rental:', error);
    throw new Error('Error al actualizar la renta');
  }
}

export async function deleteRental(id: string) {
  try {
    await prisma.rental.delete({
      where: { id },
    });
    revalidatePath('/dashboard/rentals');
    return { success: true };
  } catch (error) {
    console.error('Error deleting rental:', error);
    throw new Error('Error al eliminar la renta');
  }
}
