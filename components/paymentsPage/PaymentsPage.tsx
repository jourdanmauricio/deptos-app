'use client';

import { PlusIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Payment } from '@/shared/types/payment';
import { Modal } from '@/components/paymentsPage/Modal';
import { paymentConceptsConstants } from '@/shared/constanst';
import { CustomTable } from '@/components/ui/custom/CustomTable';
import { FilterFn, OnChangeFn, Row, type SortingState } from '@tanstack/react-table';
import { useDeletePayment, usePayments } from '@/hooks/use-payments';
import { getColumns } from '@/components/paymentsPage/table/columns';
import CustomAlertDialog from '@/components/ui/custom/custom-alert-dialog';
import { FilterPayments } from '@/components/paymentsPage/table/FilterPayments';

type PaymentsPageProps = {
  propertyId?: string;
};

const PaymentsPage = ({ propertyId }: PaymentsPageProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<Payment | null>(null);
  const [globalFilter, setGlobalFilter] = useState<{
    search: string;
    propertyId: string;
    status: string;
  }>({ search: '', propertyId: propertyId || '', status: '' });
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);

  const router = useRouter();

  const { data: payments, isLoading, error } = usePayments(globalFilter.propertyId);
  const deletePaymentMutation = useDeletePayment();

  const onEdit = useCallback((payment: Payment) => {
    setCurrentPayment(payment);
    setModalIsOpen(true);
  }, []);

  const onDelete = useCallback((payment: Payment) => {
    setCurrentRow(payment);
    setDeleteModalIsOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      getColumns({
        onEdit,
        onDelete,
      }),
    [onEdit, onDelete]
  );

  const handleSorting: OnChangeFn<SortingState> = (sorting) => {
    setSorting(sorting);
    setPageIndex(0);
  };

  const globalFilterFn: FilterFn<Payment> = (
    row: Row<Payment>
    //_columnId: string,
    //_filterValue: { search: string; propertyId: string; status: string }
  ) => {
    const payment = row.original;
    if (Object.keys(globalFilter).length === 0) return true;

    // Evaluar todas las condiciones y que todas se cumplan
    let matchesCategory = true;
    let matchesSearch = true;
    let matchesStatus = true;

    if (globalFilter.search && globalFilter.search !== '') {
      const searchTerm = globalFilter.search.toLowerCase();
      matchesSearch =
        (paymentConceptsConstants[payment.concept as keyof typeof paymentConceptsConstants]
          .toLowerCase()
          .includes(searchTerm) ||
          payment.paidDate
            ?.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
            ?.toLowerCase()
            .includes(searchTerm) ||
          `${payment.rental.tenant.lastName}, ${payment.rental.tenant.name}`
            .toLowerCase()
            .includes(searchTerm) ||
          payment.amount.toString().toLowerCase().includes(searchTerm)) ??
        false;
    }

    if (globalFilter.propertyId && globalFilter.propertyId !== '') {
      matchesCategory = payment.rental.propertyId === globalFilter.propertyId;
    }

    if (globalFilter.status && globalFilter.status !== '') {
      matchesStatus = globalFilter.status.toLowerCase() === payment.status.toLowerCase();
    }

    return matchesCategory && matchesSearch && matchesStatus === true;
  };

  const handleDialogConfirmation = async () => {
    if (currentRow) {
      await deletePaymentMutation.mutateAsync(currentRow.id);
      setCurrentRow(null);
      setDeleteModalIsOpen(false);
    }
  };

  const handleCreatePayment = () => {
    router.push('/dashboard/payments/new');
  };

  const handleSearch = (key: string, value: string) => {
    setGlobalFilter((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Pagos</h1>

        <div className='flex items-center gap-6'>
          <FilterPayments globalFilter={globalFilter} handleSearch={handleSearch} />
          <Button onClick={handleCreatePayment}>
            <PlusIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <CustomTable
        data={payments || []}
        columns={columns}
        isLoading={isLoading || deletePaymentMutation.isPending}
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
        title={'¿Estás seguro de eliminar este pago?'}
        description={'Esta acción no se puede deshacer.'}
        cancelButtonText={'Cancelar'}
        continueButtonText={'Eliminar'}
      />

      <Modal
        open={modalIsOpen}
        closeModal={() => {
          setCurrentPayment(null);
          setModalIsOpen(false);
        }}
        payment={currentPayment}
      />
    </div>
  );
};

export { PaymentsPage };
