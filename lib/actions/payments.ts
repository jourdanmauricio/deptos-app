'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Payment } from '@/lib/generated/prisma/client';

export async function getPayments(propertyId?: string) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        rental: {
          include: {
            tenant: {
              select: {
                lastName: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        rental: {
          propertyId: {
            equals: propertyId,
          },
        },
      },
      orderBy: {
        periodStart: 'asc',
      },
    });
    return payments;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw new Error('Error al obtener los pagos');
  }
}

export async function getPaymentById(id: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        rental: true,
      },
    });
    return payment;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw new Error('Error al obtener el pago');
  }
}

export async function createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const payment = await prisma.payment.create({
      data,
    });
    revalidatePath('/dashboard/payments');
    return payment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Error al crear el pago');
  }
}

export async function updatePayment(
  id: string,
  data: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    // Separar los campos de relaciones y campos que no existen en el modelo
    const { rentalId, ...otherData } = data as any;

    // Construir el objeto de datos para Prisma
    const updateData: any = { ...otherData };

    if (rentalId) {
      updateData.rental = { connect: { id: rentalId } };
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
    });
    revalidatePath('/dashboard/payments');
    // revalidatePath(`/dashboard/properties/${propertyId}`);
    return payment;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw new Error('Error al actualizar el pago');
  }
}

export async function deletePayment(id: string) {
  try {
    await prisma.payment.delete({
      where: { id },
    });
    revalidatePath('/dashboard/payments');
    return { success: true };
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw new Error('Error al eliminar el pago');
  }
}
