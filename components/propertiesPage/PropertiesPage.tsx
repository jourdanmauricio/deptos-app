'use client';

import { FilterFn, Row, SortingState, Table as TableType } from '@tanstack/react-table';
import * as XLSX from 'xlsx';
import { useMemo, useState } from 'react';
import { DownloadIcon, Plus } from 'lucide-react';

import { Property } from '@/shared/types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/propertiesPage/Modal';
import { CustomTable } from '@/components/ui/custom/CustomTable';
import { getColumns } from '@/components/propertiesPage/table/columns';
import { useProperties, useDeleteProperty } from '@/hooks/use-properties';
import CustomAlertDialog from '@/components/ui/custom/custom-alert-dialog';
import { InputFieldSeach } from '@/components/ui/custom/input-field-seach';

const PropertiesPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<Property | null>(null);
  const [globalFilter, setGlobalFilter] = useState<{
    search: string;
  }>({ search: '' });
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [tableInstance, setTableInstance] = useState<TableType<Property> | null>(null);

  const { data: properties, isLoading, error } = useProperties();
  const deletePropertyMutation = useDeleteProperty();

  const onEdit = (property: Property) => {
    setCurrentRow(property);
    setModalIsOpen(true);
  };

  const onDelete = (property: Property) => {
    setCurrentRow(property);
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

  const globalFilterFn: FilterFn<Property> = (
    row: Row<Property>,
    columnId: string,
    filterValue: { search: string }
  ) => {
    const property = row.original;
    const search = filterValue.search.toLowerCase();
    return (
      property.name.toLowerCase().includes(search) ||
      property.address.toLowerCase().includes(search) ||
      property.owner.toLowerCase().includes(search) ||
      property.description.toLowerCase().includes(search)
    );
  };

  const handleDialogConfirmation = async () => {
    if (currentRow) {
      await deletePropertyMutation.mutateAsync(currentRow.id);
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
      filteredRows.length > 0 ? filteredRows.map((row) => row.original) : properties || [];

    if (dataToExport.length === 0) {
      return;
    }

    // Definir los encabezados
    const headers = [
      'Nombre',
      'Dirección',
      'Propietario',
      'Habitaciones',
      'Baños',
      'Metros Cuadrados',
      'Piscina',
      'Garaje',
      'Jardín',
      'Cocina',
      'Expensas',
      'Año Refacción',
      'Descripción',
    ];

    // Mapear los datos de Property
    const exportData = dataToExport.map((property) => [
      property.name,
      property.address,
      property.owner,
      property.bedrooms,
      property.bathrooms,
      property.squareMeters,
      property.hasPool ? 'Sí' : 'No',
      property.hasGarage ? 'Sí' : 'No',
      property.hasGarden ? 'Sí' : 'No',
      property.hasKitchen ? 'Sí' : 'No',
      property.hasExpenses ? 'Sí' : 'No',
      property.refaccionYear,
      property.description,
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
        <h1 className='text-3xl font-bold'>Propiedades</h1>

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
        data={properties || []}
        columns={columns}
        isLoading={isLoading || deletePropertyMutation.isPending}
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
          property={currentRow}
        />
      )}

      <CustomAlertDialog
        open={deleteModalIsOpen}
        onCloseDialog={() => setDeleteModalIsOpen(false)}
        onContinueClick={handleDialogConfirmation}
        title={'¿Estás seguro de eliminar esta propiedad?'}
        description={'Esta acción no se puede deshacer.'}
        cancelButtonText={'Cancelar'}
        continueButtonText={'Eliminar'}
      />
    </div>
  );
};

export { PropertiesPage };
