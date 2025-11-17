import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { EditIcon, FileTextIcon, Trash2Icon } from 'lucide-react';
import { TruncatedCell } from '@/components/ui/custom/truncatedCell';
import { Rental } from '@/shared/types';
import { rentalStatus as rentalStatusConstants } from '@/shared/constanst';

type DataTableColumnsProps = {
  onEdit: (rental: Rental) => void;
  onDelete: (rental: Rental) => void;
};

export const getColumns = ({ onEdit, onDelete }: DataTableColumnsProps): ColumnDef<Rental>[] => [
  {
    id: 'property',
    header: 'PROPIEDAD',
    size: 0,
    minSize: 200,
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
      return <TruncatedCell value={rental.tenant.name || ''} linesMax={2} />;
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
  // {
  //   accessorKey: "owner",
  //   header: "PROPIETARIO",
  //   size: 200,
  //   cell: ({ row }) => {
  //     const property = row.original;
  //     return <TruncatedCell value={property.owner} linesMax={2} />;
  //   },
  // },
  // {
  //   accessorKey: "description",
  //   header: "DESCRIPCIÓN",
  //   size: 0,
  //   minSize: 200,
  //   cell: ({ row }) => {
  //     const property = row.original;
  //     return <TruncatedCell value={property.description} linesMax={2} />;
  //   },
  // },
  {
    id: 'actions',
    header: 'ACCIONES',
    size: 150,
    cell: ({ row }) => {
      const rental = row.original;
      return (
        <div className='flex items-center gap-2'>
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
