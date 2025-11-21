'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma.server';
import { revalidatePath } from 'next/cache';
import type { CreateUserInput, CreateUserDetailsInput, UpdateUserInput } from '@/shared/types/user';

export async function getUsers() {
  try {
    // con include de user details
    const users = await prisma.user.findMany({
      include: {
        userDetails: true,
      },
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error al obtener los usuarios');
  }
}

export async function getUserDetails(userId: string) {
  try {
    const userDetails = await prisma.userDetails.findUnique({
      where: {
        userId: userId,
      },
    });
    return userDetails;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error('Error al obtener las propiedades');
  }
}

export async function createUser(data: CreateUserInput) {
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        password: data.password ? await bcrypt.hash(data.password, 10) : '',
      },
    });
    await createUserDetails({
      userId: user.id,
      phone: data.phone || '',
      address: data.address || '',
      cbu: data.cbu || '',
      alias: data.alias || '',
      bank: data.bank || '',
      bankAccountNumber: data.bankAccountNumber || '',
      avatar: data.avatar || '',
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error al crear el usuario');
  }
}

export async function createUserDetails(data: CreateUserDetailsInput) {
  try {
    const userDetails = await prisma.userDetails.create({
      data,
    });
    revalidatePath('/dashboard/profile');
    return userDetails;
  } catch (error) {
    console.error('Error creating user details:', error);
    throw new Error('Error al crear los detalles del usuario');
  }
}

export async function updateUserDetails(id: string, data: UpdateUserInput) {
  try {
    // actualizar el usuario
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        password: data.password,
      },
    });
    // actualizar los detalles del usuario
    await prisma.userDetails.upsert({
      where: { userId: id },
      update: {
        phone: data.phone || '',
        address: data.address || '',
        cbu: data.cbu || '',
        alias: data.alias || '',
        bank: data.bank || '',
        bankAccountNumber: data.bankAccountNumber || '',
        avatar: data.avatar || '',
      },
      create: {
        userId: id,
        phone: data.phone || '',
        address: data.address || '',
        cbu: data.cbu || '',
        alias: data.alias || '',
        bank: data.bank || '',
        bankAccountNumber: data.bankAccountNumber || '',
        avatar: data.avatar || '',
      },
    });

    return user;
  } catch (error) {
    console.error('Error updating property:', error);
    throw new Error('Error al actualizando el usuario');
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.userDetails.delete({
      where: { userId: id },
    });
    await prisma.user.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Error al eliminar el usuario');
  }
}
