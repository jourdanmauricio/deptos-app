import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { EditIcon, Trash2Icon } from 'lucide-react';
import { TruncatedCell } from '@/components/ui/custom/truncatedCell';
import { Property } from '@/shared/types';
import { propertyStatus as propertyStatusConstants } from '@/shared/constanst';

type DataTableColumnsProps = {
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
};

export const getColumns = ({ onEdit, onDelete }: DataTableColumnsProps): ColumnDef<Property>[] => [
  {
    accessorKey: 'name',
    header: 'NOMBRE',
    size: 250,
    cell: ({ row }) => {
      const property = row.original;
      return <TruncatedCell value={property.name} linesMax={2} />;
    },
  },
  {
    accessorKey: 'status',
    header: 'ESTADO',
    size: 120,
    cell: ({ row }) => {
      const property = row.original;
      return <TruncatedCell value={propertyStatusConstants[property.status]} linesMax={2} />;
    },
  },
  {
    accessorKey: 'address',
    header: 'DIRECCIÓN',
    size: 0,
    minSize: 200,
    cell: ({ row }) => {
      const property = row.original;
      return <TruncatedCell value={property.address} linesMax={2} />;
    },
  },
  {
    accessorKey: 'owner',
    header: 'PROPIETARIO',
    size: 200,
    cell: ({ row }) => {
      const property = row.original;
      return <TruncatedCell value={property.owner} linesMax={2} />;
    },
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPCIÓN',
    size: 0,
    minSize: 200,
    cell: ({ row }) => {
      const property = row.original;
      return <TruncatedCell value={property.description} linesMax={2} />;
    },
  },
  {
    id: 'actions',
    header: 'ACCIONES',
    size: 120,
    minSize: 120,
    maxSize: 120,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(product)}
            className='h-8 w-8 p-0 hover:bg-blue-50'
          >
            <EditIcon className='h-4 w-4 text-blue-600' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(product)}
            className='h-8 w-8 p-0 hover:bg-red-50'
          >
            <Trash2Icon className='h-4 w-4 text-red-600' />
          </Button>
        </div>
      );
    },
  },
];
