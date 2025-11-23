import { z } from 'zod';
import { useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '@/components/ui/custom/input-field';
import { TypeStatusPartiesDropdown } from '@/components/ui/dropdowns/TypeStatusPartiesDropdown';
import { TypePartiesDropdown } from '@/components/ui/dropdowns/TypePartiesDropdown';

type FilterPartiesProps = {
  globalFilter: { search: string; status: string; type: string };
  handleSearch: (key: string, value: string) => void;
};

const FilterPartiesSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
});

const FilterParties = ({ globalFilter, handleSearch }: FilterPartiesProps) => {
  const form = useForm({
    resolver: zodResolver(FilterPartiesSchema),
    defaultValues: globalFilter,
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'search') {
        handleSearch('search', value.search || '');
      }
      if (name === 'status') {
        handleSearch('status', value.status || '');
      }
      if (name === 'type') {
        handleSearch('type', value.type || '');
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
            placeholder='Buscar tercero'
            form={form}
            enableClean
            icon={<SearchIcon className='size-4' />}
          />
          <TypeStatusPartiesDropdown
            label=''
            name='status'
            placeholder='Estado del tercero'
            form={form}
            className='min-w-[250px]'
            enableClean
          />
          <TypePartiesDropdown
            label=''
            name='type'
            placeholder='Tipo de tercero'
            form={form}
            className='min-w-[250px]'
            enableClean
          />
        </div>
      </form>
    </Form>
  );
};

export { FilterParties };
