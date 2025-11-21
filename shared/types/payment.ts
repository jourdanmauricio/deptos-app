import { Payment as PrismaPayment, Rental, Party as PrismaParty } from '@/lib/generated/prisma/client';

export type Payment = PrismaPayment & {
  rental: Rental & {
    tenant: Pick<PrismaParty, 'name' | 'lastName'>;
  };
};
