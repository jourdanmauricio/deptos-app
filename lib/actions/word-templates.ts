'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { WordTemplate } from '@/lib/generated/prisma';
import { InputJsonValue, JsonValue } from '@/lib/generated/prisma/runtime/library';

export async function getWordTemplates() {
  try {
    const wordTemplates = await prisma.wordTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return wordTemplates;
  } catch (error) {
    console.error('Error fetching word templates:', error);
    throw new Error('Error al obtener las plantillas de Word');
  }
}

export async function getWordTemplateById(id: number) {
  try {
    const wordTemplate = await prisma.wordTemplate.findUnique({
      where: { id },
    });
    return wordTemplate;
  } catch (error) {
    console.error('Error fetching word template:', error);
    throw new Error('Error al obtener la plantilla de Word');
  }
}

export async function createWordTemplate(
  data: Omit<WordTemplate, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const wordTemplate = await prisma.wordTemplate.create({
      data: {
        ...data,
        variables: data.variables as InputJsonValue,
      },
    });
    return wordTemplate;
  } catch (error) {
    console.error('Error creating word template:', error);
    throw new Error('Error al crear la plantilla de Word');
  }
}

export async function updateWordTemplate(
  id: number,
  data: Partial<Omit<WordTemplate, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    // Verificar si se está actualizando el DNI y si ya existe otro tercero con el mismo DNI
    if (data.name) {
      const existingWordTemplateByName = await prisma.wordTemplate.findFirst({
        where: {
          name: data.name,
          NOT: {
            id: id,
          },
        },
      });

      if (existingWordTemplateByName) {
        throw new Error(
          'Ya existe otra plantilla de Word con el mismo nombre. Por favor, verifique los datos.'
        );
      }
    }

    const wordTemplate = await prisma.wordTemplate.update({
      where: { id },
      data: {
        ...data,
        variables: data.variables as InputJsonValue,
      },
    });
    revalidatePath('/dashboard/word-templates');
    return wordTemplate;
  } catch (error) {
    console.error('Error updating word template:', error);
    // Si el error ya tiene un mensaje personalizado, propagarlo
    if (error instanceof Error && error.message.includes('Ya existe')) {
      throw error;
    }
    throw new Error('Error al actualizar la plantilla de Word');
  }
}

export async function deleteWordTemplate(id: number) {
  try {
    await prisma.wordTemplate.delete({
      where: { id },
    });
    revalidatePath('/dashboard/word-templates');
    return { success: true };
  } catch (error) {
    console.error('Error deleting word template:', error);
    throw new Error('Error al eliminar la plantilla de Word');
  }
}
