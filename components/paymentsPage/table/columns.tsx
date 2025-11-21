import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { EditIcon, Trash2Icon } from 'lucide-react';
import { TruncatedCell } from '@/components/ui/custom/truncatedCell';

import {
  paymentConceptsConstants,
  paymentStatus as paymentStatusConstants,
} from '@/shared/constanst';
import { Badge } from '@/components/ui/badge';
import { Payment } from '@/shared/types/payment';

type DataTableColumnsProps = {
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
};

export const getColumns = ({ onEdit, onDelete }: DataTableColumnsProps): ColumnDef<Payment>[] => [
  {
    id: 'tenant',
    header: 'INQUILINO',
    size: 200,
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
    size: 0,
    minSize: 200,
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
        // <TruncatedCell
        //   value={paymentStatusConstants[payment.status as keyof typeof paymentStatusConstants]}
        //   linesMax={2}
        // />
      );
    },
  },
  {
    accessorKey: 'concept',
    header: 'CONCEPTO',
    size: 0,
    minSize: 200,
    cell: ({ row }) =>
      paymentConceptsConstants[row.original.concept as keyof typeof paymentConceptsConstants],
  },
  {
    accessorKey: 'periodMonth',
    header: 'MES',
    size: 0,
    minSize: 200,
    cell: ({ row }) => row.original.periodMonth?.toString() || '-',
  },
  {
    accessorKey: 'paidDate',
    header: 'FECHA PAGO',
    size: 0,
    minSize: 200,
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
    size: 0,
    minSize: 200,
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
    id: 'actions',
    header: 'ACCIONES',
    size: 180,
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
