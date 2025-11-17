'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Property } from '@/shared/types/property';

export async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return properties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error('Error al obtener las propiedades');
  }
}

export async function getPropertyById(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });
    return property;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw new Error('Error al obtener la propiedad');
  }
}

export async function createProperty(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const property = await prisma.property.create({
      data,
    });
    revalidatePath('/dashboard/properties');
    return property;
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Error al crear la propiedad');
  }
}

export async function updateProperty(
  id: string,
  data: Partial<Omit<Property, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    const property = await prisma.property.update({
      where: { id },
      data,
    });
    revalidatePath('/dashboard/properties');
    return property;
  } catch (error) {
    console.error('Error updating property:', error);
    throw new Error('Error al actualizar la propiedad');
  }
}

export async function deleteProperty(id: string) {
  try {
    await prisma.property.delete({
      where: { id },
    });
    revalidatePath('/dashboard/properties');
    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Error al eliminar la propiedad');
  }
}
