'use client';

import { PlusIcon } from 'lucide-react';
import { InputFieldSeach } from '../ui/custom/input-field-seach';
import { Button } from '../ui/button';
import { useMemo, useState } from 'react';
import { CustomTable } from '../ui/custom/CustomTable';
import { useWordTemplates, useDeleteWordTemplate } from '@/hooks/use-word-templates';
import { WordTemplate } from '@/shared/types/word-template';
import { FilterFn, Row, SortingState } from '@tanstack/react-table';
import { getColumns } from '@/components/wordAssistantPage/table/columns';
import { Modal } from '@/components/wordAssistantPage/Modal';
import CustomAlertDialog from '@/components/ui/custom/custom-alert-dialog';

const WordAssistantPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<WordTemplate | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<{
    search: string;
  }>({ search: '' });
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  const { data: wordTemplates, isLoading, error } = useWordTemplates();
  const deleteWordTemplateMutation = useDeleteWordTemplate();

  const onEdit = (template: WordTemplate) => {
    setCurrentRow(template);
    setModalIsOpen(true);
  };

  const onDelete = (template: WordTemplate) => {
    setCurrentRow(template);
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

  const globalFilterFn: FilterFn<WordTemplate> = (
    row: Row<WordTemplate>,
    columnId: string,
    filterValue: { search: string }
  ) => {
    const party = row.original;
    const search = filterValue.search.toLowerCase();
    return (
      party.name.toLowerCase().includes(search) || party.description.toLowerCase().includes(search)
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Plantillas de Word</h1>

        <div className='flex items-center gap-6'>
          <InputFieldSeach setGlobalFilter={setGlobalFilter} />
          <Button onClick={() => setModalIsOpen(true)}>
            <PlusIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <CustomTable
        data={wordTemplates || []}
        columns={columns}
        isLoading={isLoading || deleteWordTemplateMutation.isPending}
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
      {modalIsOpen && (
        <Modal
          open={modalIsOpen}
          closeModal={() => {
            setCurrentRow(null);
            setModalIsOpen(false);
          }}
          template={currentRow}
        />
      )}
      {deleteModalIsOpen && (
        <CustomAlertDialog
          open={deleteModalIsOpen}
          onCloseDialog={() => setDeleteModalIsOpen(false)}
          onContinueClick={() => deleteWordTemplateMutation.mutate(currentRow!.id.toString())}
          title={'¿Estás seguro de eliminar esta plantilla?'}
          description={'Esta acción no se puede deshacer.'}
          cancelButtonText={'Cancelar'}
          continueButtonText={'Eliminar'}
        />
      )}
    </div>
  );
};

export { WordAssistantPage };
