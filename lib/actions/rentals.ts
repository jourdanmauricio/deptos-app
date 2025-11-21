'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  PaymentConcept,
  Rental as PrismaRental,
  PropertyStatus,
  PaymentStatus,
} from '@/lib/generated/prisma/client';
import { endOfMonth } from 'date-fns';

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
    await prisma.property.update({
      where: { id: data.propertyId },
      data: {
        status: PropertyStatus.RENTED,
      },
    });
    // TODO: El monto es el inicialRent para los primeros meses. Depende de updateMonths.
    // Luego de los primeros meses, el monto se coloca en 0
    let amount = data.initialRent;

    // periodStart es el primer dia del mes
    const periodStart = new Date(data.startDate);
    periodStart.setDate(1);

    // periodEnd ultimo dia del mismo mes que periodStart
    let periodEnd = endOfMonth(periodStart);

    for (let i = 0; i < data.contractDurationYears * 12; i++) {
      if (i < (data.rentUpdateMonths || 0)) {
        amount = data.initialRent;
      } else {
        amount = 0;
      }

      await prisma.payment.create({
        data: {
          rentalId: rental.id,
          amount: amount,
          penalty: data.penaltyRate,
          total: data.initialRent + (data.penaltyRate || 0),
          paidDate: periodStart,
          status: PaymentStatus.PENDING,
          paymentMethod: data.paymentMethod,
          concept: PaymentConcept.RENT,
          periodStart,
          periodEnd,
          periodMonth: periodStart.getMonth() + 1,
        },
      });
      periodStart.setMonth(periodStart.getMonth() + 1);
      periodEnd = endOfMonth(periodStart);
    }

    // TODO: si el alquiler tiene garantía, crear el pago de la garantía
    if (data.deposit > 0) {
      await prisma.payment.create({
        data: {
          rentalId: rental.id,
          amount: data.deposit,
          concept: PaymentConcept.DEPOSIT_GUARANTOR,
          paidDate: data.startDate,
          status: PaymentStatus.PENDING,
          paymentMethod: data.paymentMethod,
          periodStart: data.startDate,
          // periodEnd ultimo dia del mismo mes que startDate
          periodEnd: new Date(data.startDate.getFullYear(), data.startDate.getMonth() + 1, 0),
          periodMonth: 0,
        },
      });
    }

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
    // Separar los campos de relaciones y campos que no existen en el modelo
    const { propertyId, tenantId, ownerId, guarantors, wordTemplateId, content, ...otherData } =
      data as any;

    // Construir el objeto de datos para Prisma
    const updateData: any = { ...otherData };

    // Agregar operaciones anidadas para las relaciones
    if (propertyId) {
      updateData.property = { connect: { id: propertyId } };
    }
    if (tenantId) {
      updateData.tenant = { connect: { id: tenantId } };
    }
    if (ownerId) {
      updateData.owner = { connect: { id: ownerId } };
    }
    if (guarantors && Array.isArray(guarantors)) {
      updateData.guarantors = {
        set: guarantors.map((id: string) => ({ id })),
      };
    }
    if (wordTemplateId) {
      updateData.wordTemplate = { connect: { id: wordTemplateId } };
    }

    const rental = await prisma.rental.update({
      where: { id },
      data: updateData,
    });
    revalidatePath('/dashboard/rentals');
    // revalidatePath(`/dashboard/properties/${propertyId}`);
    return rental;
  } catch (error) {
    console.error('Error updating rental:', error);
    throw new Error('Error al actualizar la renta');
  }
}

export async function deleteRental(id: string, propertyId: string) {
  try {
    await prisma.rental.delete({
      where: { id },
    });
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: PropertyStatus.ACTIVE,
      },
    });

    revalidatePath('/dashboard/rentals');
    return { success: true };
  } catch (error) {
    console.error('Error deleting rental:', error);
    throw new Error('Error al eliminar la renta');
  }
}
