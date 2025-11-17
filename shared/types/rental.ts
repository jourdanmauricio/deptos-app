import { Rental as PrismaRental, Property, Party } from '@/lib/generated/prisma';

export type Rental = RentalWithProperty;

export type RentalWithProperty = PrismaRental & {
  property: Property;
  tenant: Party;
};
