'use client';

import { FilterFn, Row, SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import HTMLtoDOCX from 'html-to-docx';
import { saveAs } from 'file-saver';
import * as htmlDocx from 'html-docx-js';

import { Rental } from '@/shared/types';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CustomTable } from '@/components/ui/custom/CustomTable';
import { getColumns } from '@/components/rentalsPage/table/columns';
import CustomAlertDialog from '@/components/ui/custom/custom-alert-dialog';
import { InputFieldSeach } from '@/components/ui/custom/input-field-seach';
import { useDeleteRental, useRentals } from '@/hooks/use-rentals';
import { toast } from 'sonner';

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

  const onDownloadContract = async (rental: Rental) => {
    const content = rental.contractContent || '';
    const fileName = `contrato_${rental.tenantId}_${Date.now()}.docx`;

    try {
      const response = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          fileName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      toast.success('Iniciando descarga del contrato...');
      // Obtener el blob y descargarlo
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading contract:', error);
      // Aquí podrías mostrar un toast de error
      toast.error('Error al descargar el contrato');
    }
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit,
        onDelete,
        onDownloadContract,
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
