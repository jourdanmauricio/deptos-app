import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { EditIcon, Trash2Icon } from 'lucide-react';
import { TruncatedCell } from '@/components/ui/custom/truncatedCell';
import { Party } from '@/shared/types';
import Image from 'next/image';

type DataTableColumnsProps = {
  onEdit: (party: Party) => void;
  onDelete: (party: Party) => void;
};

export const getColumns = ({ onEdit, onDelete }: DataTableColumnsProps): ColumnDef<Party>[] => [
  {
    accessorKey: 'name',
    header: 'NOMBRE',
    size: 0,
    minSize: 200,
    maxSize: 350,
    cell: ({ row }) => {
      const property = row.original;
      return <TruncatedCell value={`${property.lastName}, ${property.name}`} linesMax={2} />;
    },
  },
  {
    accessorKey: 'phone',
    header: 'TELÉFONO',
    size: 150,
    cell: ({ row }) => {
      const property = row.original;
      return <TruncatedCell value={property.phone} linesMax={2} />;
    },
  },
  {
    accessorKey: 'type',
    header: 'TIPO',
    size: 120,
    cell: ({ row }) => {
      const party = row.original;
      const typeLabels: Record<string, string> = {
        TENANT: 'Inquilino',
        GUARANTOR: 'Garante',
        OWNER: 'Propietario',
      };
      return <TruncatedCell value={typeLabels[party.type] || party.type} linesMax={2} />;
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
