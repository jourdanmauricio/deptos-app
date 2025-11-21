import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { CoinsIcon, EditIcon, FileTextIcon, Trash2Icon } from 'lucide-react';
import { TruncatedCell } from '@/components/ui/custom/truncatedCell';
import { Rental } from '@/shared/types';
import { rentalStatus as rentalStatusConstants } from '@/shared/constanst';

type DataTableColumnsProps = {
  onEdit: (rental: Rental) => void;
  onDelete: (rental: Rental) => void;
  onDownloadContract: (rental: Rental) => void;
  onPayRental: (rental: Rental) => void;
};

export const getColumns = ({
  onEdit,
  onDelete,
  onDownloadContract,
  onPayRental,
}: DataTableColumnsProps): ColumnDef<Rental>[] => [
  {
    id: 'property',
    header: 'PROPIEDAD',
    size: 0,
    minSize: 300,
    maxSize: 350,
    cell: ({ row }) => {
      const rental = row.original;
      return <TruncatedCell value={rental.property?.name || ''} linesMax={2} />;
    },
  },
  {
    id: 'tenant',
    header: 'INQUILINO',
    size: 200,
    cell: ({ row }) => {
      const rental = row.original;
      return (
        <TruncatedCell
          value={`${rental.tenant.lastName}, ${rental.tenant.name}` || ''}
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
      const rental = row.original;
      return <TruncatedCell value={rentalStatusConstants[rental.status]} linesMax={2} />;
    },
  },
  {
    accessorKey: 'endDate',
    header: 'FECHA FIN',
    size: 0,
    minSize: 200,
    cell: ({ row }) =>
      row.original.endDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
  },

  {
    id: 'actions',
    header: 'ACCIONES',
    size: 180,
    cell: ({ row }) => {
      const rental = row.original;
      return (
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onPayRental(rental)}
            className='h-8 w-8 p-0 hover:bg-yellow-50'
          >
            <CoinsIcon className='h-4 w-4 text-yellow-600' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDownloadContract(rental)}
            className='h-8 w-8 p-0 hover:bg-green-50'
          >
            <FileTextIcon className='h-4 w-4 text-green-600' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(rental)}
            className='h-8 w-8 p-0 hover:bg-blue-50'
          >
            <EditIcon className='h-4 w-4 text-blue-600' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(rental)}
            className='h-8 w-8 p-0 hover:bg-red-50'
          >
            <Trash2Icon className='h-4 w-4 text-red-600' />
          </Button>
        </div>
      );
    },
  },
];
