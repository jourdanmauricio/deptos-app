import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { EditIcon, Trash2Icon } from 'lucide-react';

import {
  paymentConceptsConstants,
  paymentStatus as paymentStatusConstants,
} from '@/shared/constanst';
import { Badge } from '@/components/ui/badge';
import { Payment } from '@/shared/types/payment';
import { TruncatedCell } from '@/components/ui/custom/truncatedCell';
import { rentalStatus as rentalStatusConstants } from '@/shared/constanst';

type DataTableColumnsProps = {
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
};

export const getColumns = ({ onEdit, onDelete }: DataTableColumnsProps): ColumnDef<Payment>[] => [
  {
    id: 'tenant',
    header: 'INQUILINO',
    size: 0,
    minSize: 200,
    maxSize: 350,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <TruncatedCell
          value={`${payment.rental.tenant.lastName}, ${payment.rental.tenant.name}`}
          linesMax={2}
        />
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'ESTADO',
    size: 120,
    cell: ({ row }) => {
      const payment = row.original;
      const today = new Date();
      let colors = 'bg-green-300 text-green-900';
      if (payment.status === 'PENDING') {
        colors = 'bg-yellow-300 text-yellow-900';
        // si hoy es mayor a la fecha 10 del mismo mes que el pago, cambiar a rojo
        if (
          today.getDate() > 10 &&
          today.getMonth() === payment.paidDate?.getMonth() &&
          today.getFullYear() === payment.paidDate?.getFullYear()
        ) {
          colors = 'bg-red-300 text-red-900';
        }
      } else if (payment.status === 'PAID') {
        colors = 'bg-green-300 text-green-900';
      } else if (payment.status === 'LATE') {
        colors = 'bg-red-300 text-red-900';
      } else if (payment.status === 'CANCELLED') {
        colors = 'bg-gray-300 text-gray-900';
      }
      return (
        <Badge variant='outline' className={`mx-auto ${colors}`}>
          {paymentStatusConstants[payment.status as keyof typeof paymentStatusConstants]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'concept',
    header: 'CONCEPTO',
    size: 0,
    minSize: 200,
    maxSize: 400,
    cell: ({ row }) =>
      paymentConceptsConstants[row.original.concept as keyof typeof paymentConceptsConstants],
  },
  {
    accessorKey: 'periodMonth',
    header: 'MES',
    size: 80,
    cell: ({ row }) => row.original.periodMonth?.toString() || '-',
  },
  {
    accessorKey: 'rentalStatus',
    header: 'ESTADO RENTA',
    size: 130,
    cell: ({ row }) =>
      rentalStatusConstants[row.original.rental.status as keyof typeof rentalStatusConstants],
  },
  {
    accessorKey: 'paidDate',
    header: 'FECHA PAGO',
    size: 110,
    cell: ({ row }) =>
      row.original.paidDate?.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) || '-',
  },
  {
    accessorKey: 'amount',
    header: 'MONTO',
    size: 100,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <span className={`${payment.amount === 0 ? 'font-bold text-green-900' : ''}`}>
          {payment.amount === 0 ? 'Ajuste' : payment.amount}
        </span>
      );
    },
  },
  {
    accessorKey: 'penalty',
    header: 'INTERES',
    size: 100,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <span className={`${payment.amount === 0 ? 'font-bold text-green-900' : ''}`}>
          {payment.amount === 0 ? 'Ajuste' : payment.penalty?.toString() || '0'}
        </span>
      );
    },
  },
  {
    accessorKey: 'total',
    header: 'TOTAL',
    size: 90,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <span className={`${payment.amount === 0 ? 'font-bold text-green-900' : ''}`}>
          {payment.amount === 0 ? 'Ajuste' : payment.total?.toString() || '0'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'ACCIONES',
    size: 120,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(payment)}
            className='h-8 w-8 p-0 hover:bg-blue-50'
          >
            <EditIcon className='h-4 w-4 text-blue-600' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(payment)}
            className='h-8 w-8 p-0 hover:bg-red-50'
          >
            <Trash2Icon className='h-4 w-4 text-red-600' />
          </Button>
        </div>
      );
    },
  },
];
