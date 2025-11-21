import z from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { SearchIcon } from 'lucide-react';
import { PropertiesDropdown } from '@/components/ui/dropdowns/PropertiesDropdown';
import { InputField } from '@/components/ui/custom/input-field';
import { TypePaymentStatusDropdown } from '@/components/ui/dropdowns/TypePaymentStatusDropdown';

interface FilterProps {
  globalFilter: { search: string; propertyId: string; status: string };
  handleSearch: (key: string, value: string) => void;
}

const FilterPaymentsSchema = z.object({
  search: z.string().optional(),
  propertyId: z.string().optional(),
  status: z.string().optional(),
});

const FilterPayments = ({ globalFilter, handleSearch }: FilterProps) => {
  const form = useForm({
    resolver: zodResolver(FilterPaymentsSchema),
    defaultValues: globalFilter,
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'search') {
        handleSearch('search', value.search || '');
      }
      if (name === 'propertyId') {
        handleSearch('propertyId', value.propertyId || '');
      }
      if (name === 'status') {
        handleSearch('status', value.status || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form, handleSearch]);

  return (
    <Form {...form}>
      <form>
        <div className='flex items-center gap-4'>
          <InputField
            label=''
            name='search'
            className='min-w-[250px]'
            placeholder='Buscar pago'
            form={form}
            enableClean
            icon={<SearchIcon className='size-4' />}
          />
          <TypePaymentStatusDropdown
            label=''
            name='status'
            placeholder='Estado del pago'
            form={form}
            className='min-w-[250px]'
            enableClean
          />
          <PropertiesDropdown
            label=''
            name='propertyId'
            placeholder='Propiedad'
            form={form}
            className='min-w-[250px]'
            filterStatus={false}
            selectValue={globalFilter.propertyId ? undefined : 'FIRST'}
          />
        </div>
      </form>
    </Form>
  );
};

export { FilterPayments };
