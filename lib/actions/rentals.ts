'use server';

import prisma from '@/lib/prisma.server';
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
    const rental = await prisma.$transaction(async (tx) => {
      const rental = await tx.rental.create({
        data,
      });
      await tx.property.update({
        where: { id: data.propertyId },
        data: {
          status: PropertyStatus.RENTED,
        },
      });

      // Preparar todos los pagos en un array
      const payments = [];

      // periodStart es el primer dia del mes
      let periodStart = new Date(data.startDate);
      periodStart.setDate(1);

      for (let i = 0; i < data.contractDurationYears * 12; i++) {
        const amount = i < (data.rentUpdateMonths || 0) ? data.initialRent : 0;

        // Crear nueva instancia de Date para cada periodo
        const currentPeriodStart = new Date(periodStart);
        const periodEnd = endOfMonth(currentPeriodStart);

        payments.push({
          rentalId: rental.id,
          amount: amount,
          penalty: data.penaltyRate,
          total: data.initialRent + (data.penaltyRate || 0),
          paidDate: currentPeriodStart,
          status: PaymentStatus.PENDING,
          paymentMethod: data.paymentMethod,
          concept: PaymentConcept.RENT,
          periodStart: currentPeriodStart,
          periodEnd,
          periodMonth: currentPeriodStart.getMonth() + 1,
        });

        periodStart.setMonth(periodStart.getMonth() + 1);
      }

      // Si el alquiler tiene garantía, agregar el pago de la garantía
      if (data.deposit > 0) {
        payments.push({
          rentalId: rental.id,
          amount: data.deposit,
          concept: PaymentConcept.DEPOSIT_GUARANTOR,
          paidDate: data.startDate,
          status: PaymentStatus.PENDING,
          paymentMethod: data.paymentMethod,
          periodStart: data.startDate,
          periodEnd: new Date(data.startDate.getFullYear(), data.startDate.getMonth() + 1, 0),
          periodMonth: 0,
          penalty: null,
          total: data.deposit,
        });
      }

      // Crear todos los pagos de una sola vez
      await tx.payment.createMany({
        data: payments,
      });

      return rental;
    });

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
    const { propertyId, tenantId, ownerId, guarantors, wordTemplateId, ...otherData } = data as any;

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
    return rental;
  } catch (error) {
    console.error('Error updating rental:', error);
    throw new Error('Error al actualizar la renta');
  }
}

export async function deleteRental(id: string, propertyId: string) {
  try {
    await prisma.$transaction([
      prisma.rental.delete({
        where: { id },
      }),
      prisma.property.update({
        where: { id: propertyId },
        data: {
          status: PropertyStatus.ACTIVE,
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error deleting rental:', error);
    throw new Error('Error al eliminar la renta');
  }
}
