'use client';

import { FilterFn, Row, SortingState, Table as TableType } from '@tanstack/react-table';
import * as XLSX from 'xlsx';
import { useMemo, useState } from 'react';
import { DownloadIcon, Plus } from 'lucide-react';

import { Party } from '@/shared/types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/partiesPage/Modal';
import { CustomTable } from '@/components/ui/custom/CustomTable';
import { getColumns } from '@/components/partiesPage/table/columns';
import CustomAlertDialog from '@/components/ui/custom/custom-alert-dialog';
import { InputFieldSeach } from '@/components/ui/custom/input-field-seach';
import { useDeleteParty, useParties } from '@/hooks/use-parties';

const PartiesPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<Party | null>(null);
  const [globalFilter, setGlobalFilter] = useState<{
    search: string;
  }>({ search: '' });
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [tableInstance, setTableInstance] = useState<TableType<Party> | null>(null);

  const { data: parties, isLoading, error } = useParties();
  const deletePartyMutation = useDeleteParty();

  const onEdit = (party: Party) => {
    setCurrentRow(party);
    setModalIsOpen(true);
  };

  const onDelete = (party: Party) => {
    setCurrentRow(party);
    setDeleteModalIsOpen(true);
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit,
        onDelete,
      }),
    [onEdit, onDelete]
  );

  const handleSorting = (sorting: SortingState) => {
    setSorting(sorting);
    setPageIndex(0);
  };

  const globalFilterFn: FilterFn<Party> = (
    row: Row<Party>,
    columnId: string,
    filterValue: { search: string }
  ) => {
    const party = row.original;
    const search = filterValue.search.toLowerCase();
    return (
      party.name.toLowerCase().includes(search) ||
      party.lastName.toLowerCase().includes(search) ||
      party.email.toLowerCase().includes(search) ||
      party.phone.toLowerCase().includes(search) ||
      party.dni.toLowerCase().includes(search) ||
      party.description.toLowerCase().includes(search)
    );
  };

  const handleDialogConfirmation = async () => {
    if (currentRow) {
      await deletePartyMutation.mutateAsync(currentRow.id);
      setCurrentRow(null);
      setDeleteModalIsOpen(false);
    }
  };

  const handleDownload = () => {
    if (!tableInstance) {
      console.warn('Instancia de tabla no disponible');
      return;
    }

    // Obtener datos filtrados usando la API de TanStack Table
    const filteredRows = tableInstance.getFilteredRowModel().rows;
    const dataToExport =
      filteredRows.length > 0 ? filteredRows.map((row) => row.original) : parties || [];

    if (dataToExport.length === 0) {
      return;
    }

    // Definir los encabezados
    const headers = [
      'Nombre',
      'Dirección',
      'Tipo',
      'DNI',
      'Teléfono',
      'Email',
      'Trabajo',
      'Descripción',
    ];

    // Mapear los datos de Property
    const exportData = dataToExport.map((party) => [
      `${party.lastName}, ${party.name}`,
      party.address,
      party.type,
      party.dni,
      party.phone,
      party.email,
      party.job,
      party.description,
    ]);

    const worksheetData = [headers, ...exportData];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Auto-ajustar el ancho de las columnas
    const autoFitColumns = (
      worksheet: XLSX.WorkSheet,
      worksheetData: (string | number | null)[][]
    ) => {
      const colWidths = worksheetData[0].map((_, colIndex) => ({
        wch: Math.max(
          ...worksheetData.map((row) => {
            const cell = row[colIndex];
            return cell ? cell.toString().length + 2 : 10;
          })
        ),
      }));
      worksheet['!cols'] = colWidths;
    };

    autoFitColumns(worksheet, worksheetData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Propiedades');

    XLSX.writeFile(workbook, 'propiedades.xlsx');
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Terceros</h1>

        <div className='flex items-center gap-6'>
          <InputFieldSeach setGlobalFilter={setGlobalFilter} />
          <Button onClick={handleDownload}>
            <DownloadIcon className='h-4 w-4' />
          </Button>
          <Button onClick={() => setModalIsOpen(true)}>
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <CustomTable
        data={parties || []}
        columns={columns}
        isLoading={isLoading || deletePartyMutation.isPending}
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
        onTableInstanceReady={setTableInstance}
      />

      {modalIsOpen && (
        <Modal
          open={modalIsOpen}
          closeModal={() => {
            setCurrentRow(null);
            setModalIsOpen(false);
          }}
          party={currentRow}
        />
      )}

      <CustomAlertDialog
        open={deleteModalIsOpen}
        onCloseDialog={() => setDeleteModalIsOpen(false)}
        onContinueClick={handleDialogConfirmation}
        title={'¿Estás seguro de eliminar este tercero?'}
        description={'Esta acción no se puede deshacer.'}
        cancelButtonText={'Cancelar'}
        continueButtonText={'Eliminar'}
      />
    </div>
  );
};

export { PartiesPage };
