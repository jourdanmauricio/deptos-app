import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { EditIcon, Trash2Icon } from 'lucide-react';
import { TruncatedCell } from '@/components/ui/custom/truncatedCell';
import { User } from '@/shared/types';

// import { format } from 'date-fns';

type DataTableColumnsProps = {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export const getColumns = ({ onEdit, onDelete }: DataTableColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: 'name',
    header: 'NOMBRE',
    size: 200,
    cell: ({ row }) => {
      const property = row.original;
      return <TruncatedCell value={property.name} linesMax={2} />;
    },
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    size: 0,
    minSize: 200,
    cell: ({ row }) => {
      const user = row.original;
      return <TruncatedCell value={user.email} linesMax={2} />;
    },
  },
  {
    accessorKey: 'phone',
    header: 'TELÉFONO',
    size: 200,
    cell: ({ row }) => {
      const user = row.original;
      return <TruncatedCell value={user.userDetails?.phone || ''} linesMax={2} />;
    },
  },
  {
    accessorKey: 'role',
    header: 'ROL',
    size: 200,
    cell: ({ row }) => row.original.role.toUpperCase(),
  },
  {
    accessorKey: 'userDetails',
    header: 'PERFIL',
    size: 0,
    minSize: 200,
    cell: ({ row }) => {
      const user = row.original;
      return <TruncatedCell value={user.userDetails ? 'SI' : 'NO'} linesMax={2} />;
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
