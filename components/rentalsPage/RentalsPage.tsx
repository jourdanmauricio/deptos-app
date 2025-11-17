'use client';

import { FilterFn, Row, SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { PlusIcon } from 'lucide-react';

import { Rental } from '@/shared/types';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CustomTable } from '@/components/ui/custom/CustomTable';
import { getColumns } from '@/components/rentalsPage/table/columns';
import CustomAlertDialog from '@/components/ui/custom/custom-alert-dialog';
import { InputFieldSeach } from '@/components/ui/custom/input-field-seach';
import { useDeleteRental, useRentals } from '@/hooks/use-rentals';

const RentalsPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<Rental | null>(null);
  const [globalFilter, setGlobalFilter] = useState<{
    search: string;
  }>({ search: '' });
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();

  const { data: rentals, isLoading, error } = useRentals();
  const deleteRentalMutation = useDeleteRental();

  const onEdit = (rental: Rental) => {
    router.push(`/dashboard/rentals/${rental.id}`);
  };

  console.log('rentals', rentals);

  const onDelete = (rental: Rental) => {
    setCurrentRow(rental);
    setDeleteModalIsOpen(true);
  };

  const onGenerate = (rental: Rental) => {
    console.log('onGenerate', rental);
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit,
        onDelete,
        onGenerate,
      }),
    [onEdit, onDelete]
  );

  const handleSorting = (sorting: SortingState) => {
    setSorting(sorting);
    setPageIndex(0);
  };

  const globalFilterFn: FilterFn<Rental> = (
    row: Row<Rental>,
    columnId: string,
    filterValue: { search: string }
  ) => {
    const rental = row.original;
    const search = filterValue.search.toLowerCase();
    return rental.property.name.toLowerCase().includes(search);
    // rental.address.toLowerCase().includes(search) ||
    // rental.owner.toLowerCase().includes(search) ||
    // rental.description.toLowerCase().includes(search)
  };

  const handleDialogConfirmation = async () => {
    if (currentRow) {
      await deleteRentalMutation.mutateAsync(currentRow.id);
      setCurrentRow(null);
      setDeleteModalIsOpen(false);
    }
  };

  const handleCreateRental = () => {
    router.push('/dashboard/rentals/new');
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Alquileres</h1>

        <div className='flex items-center gap-6'>
          <InputFieldSeach setGlobalFilter={setGlobalFilter} />
          <Button onClick={handleCreateRental}>
            <PlusIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <CustomTable
        data={rentals || []}
        columns={columns}
        isLoading={isLoading || deleteRentalMutation.isPending}
        globalFilter={globalFilter}
        error={!!error}
        sorting={sorting}
        handleSorting={handleSorting}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        globalFilterFn={globalFilterFn}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
        getRowId={(row) => row.id.toString()}
      />

      <CustomAlertDialog
        open={deleteModalIsOpen}
        onCloseDialog={() => setDeleteModalIsOpen(false)}
        onContinueClick={handleDialogConfirmation}
        title={'¿Estás seguro de eliminar este alquiler?'}
        description={'Esta acción no se puede deshacer.'}
        cancelButtonText={'Cancelar'}
        continueButtonText={'Eliminar'}
      />
    </div>
  );
};

export { RentalsPage };
