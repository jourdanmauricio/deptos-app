// import { UserRole } from '@/lib/generated/prisma/client';
import z from 'zod';

export const loginFormSchema = z.object({
  email: z.email({ message: 'Email inválido' }).min(1, 'Requerido'),
  password: z.string().min(1, 'Requerido'),
});

export const propertyFormSchema = z.object({
  parcelId: z.string().min(1, 'Requerido'),
  name: z.string().min(1, 'Requerido'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'RENTED']),
  nisElektrik: z.string().optional(),
  gas: z.string().optional(),
  abl: z.string().optional(),
  absa: z.string().optional(),
  address: z.string().min(1, 'Requerido'),
  bedrooms: z.string().min(1, 'Requerido'),
  bathrooms: z.string().min(1, 'Requerido'),
  hasPool: z.boolean(),
  hasGarage: z.boolean(),
  hasGarden: z.boolean(),
  hasKitchen: z.boolean(),
  hasExpenses: z.boolean(),
  squareMeters: z.string().min(1, 'Requerido'),
  owner: z.string().min(1, 'Requerido'),
  description: z.string().min(1, 'Requerido'),
  refaccionYear: z.string().min(1, 'Requerido'),
});

export const userFormSchema = z.object({
  password: z.string().optional(),
  email: z.email({ message: 'Email inválido' }).min(1, 'Requerido'),
  name: z.string().min(1, 'Requerido'),
  role: z.enum(['ADMIN', 'USER']),
  phone: z.string().min(1, 'Requerido'),
  address: z.string().optional(),
  cbu: z.string().optional(),
  alias: z.string().optional(),
  bank: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  avatar: z.string().optional(),
});

export const partyFormSchema = z.object({
  name: z.string().min(1, 'Requerido'),
  lastName: z.string().min(1, 'Requerido'),
  type: z.enum(['TENANT', 'GUARANTOR', 'OWNER']),
  dni: z.string().min(1, 'Requerido'),
  cuil: z.string().min(1, 'Requerido'),
  phone: z.string().min(1, 'Requerido'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  email: z
    .union([z.string().email({ message: 'Email inválido' }), z.literal('')])
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  documentFront: z.union([z.instanceof(File), z.string()]).optional(),
  documentBack: z.union([z.instanceof(File), z.string()]).optional(),
  payslip: z.union([z.instanceof(File), z.string()]).optional(),
  description: z.string().optional(),
  address: z.string().min(1, 'Requerido'),
  job: z.string().optional(),
  bank: z.string().optional(),
  accountNumber: z.string().optional(),
  cbu: z.string().optional(),
  alias: z.string().optional(),
});

export const rentalFormSchema = z.object({
  propertyId: z.string().min(1, 'Requerido'),
  tenantId: z.string().min(1, 'Requerido'),
  guarantors: z.array(z.string()),
  ownerId: z.string().min(1, 'Requerido'),
  signedDate: z.date().min(1, 'Requerido'),
  startDate: z.date().min(1, 'Requerido'),
  endDate: z.date().min(1, 'Requerido'),
  terminationDate: z.date().optional(),
  initialRent: z.string().min(1, 'Requerido'),
  rentUpdateMonths: z.string().min(1, 'Requerido'),
  contractDurationYears: z.string().min(1, 'Requerido'),
  penaltyRate: z.string().min(1, 'Requerido'),
  rescissionRate: z.string().min(1, 'Requerido'),
  currency: z.string(),
  indexationType: z.enum(['IPC', 'ICL', 'FIXED']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED', 'CANCELLED']),
  deposit: z.string().min(1, 'Requerido'),
  paymentMethod: z.enum([
    'CASH',
    'CHECK',
    'TRANSFER',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'ONLINE',
    'OTHER',
  ]),
  billing: z.boolean(),
  contractUrl: z.string().optional(),
  wordTemplateId: z.string().min(1, 'Requerido'),
  observation: z.string().optional(),
  contractContent: z.string().optional(),
});

export const wordTemplateFormSchema = z.object({
  name: z.string().min(1, 'Requerido'),
  type: z.enum([
    'RENTAL_CONTRACT_HOME',
    'RENTAL_CONTRACT_COMMERCIAL',
    'RENTAL_RECEIPT',
    'CONTRACT_CANCELLATION',
  ]),
  description: z.string().optional(),
  content: z.string().min(1, 'Requerido'),
  variables: z.array(z.string()).optional(),
});

export const paymentFormSchema = z.object({
  propertyId: z.string().optional(),
  tenantId: z.string().optional(),
  rentalId: z.string().min(1, 'Requerido'),
  amount: z.string().min(1, 'Requerido'),
  penalty: z.string().optional(),
  total: z.string().optional(),
  concept: z.enum(['RENT', 'EXPENSES', 'EXTRA_EXPENSES', 'DEPOSIT_GUARANTOR', 'OTHER']),
  paidDate: z.date(),
  status: z.enum(['PENDING', 'PAID', 'LATE', 'CANCELLED']),
  paymentMethod: z.enum([
    'CASH',
    'CHECK',
    'TRANSFER',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'ONLINE',
    'OTHER',
  ]),
  referenceNumber: z.string().optional(),
  imageUrl: z.union([z.instanceof(File), z.string()]).optional(),
  notes: z.string().optional(),
  periodStart: z.date(),
  periodEnd: z.date(),
  periodMonth: z.string().min(1, 'Requerido'),
});
