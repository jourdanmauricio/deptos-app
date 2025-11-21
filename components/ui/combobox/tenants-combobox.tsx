import { ComboboxForm } from '@/components/ui/custom/combobox';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getTenants } from '@/lib/actions/parties';
import { useQuery } from '@tanstack/react-query';

import { useFormContext, type UseFormReturn, FieldValues, type Path } from 'react-hook-form';
import { PartyType } from '@/lib/generated/prisma/client';

type TenantItem = {
  id: string;
  description: string;
  type: PartyType;
  property: string;
};

type DropdownProps<T extends FieldValues = FieldValues> = {
  label: string;
  name: Path<T>;
  placeholder: string;
  form: UseFormReturn<T>;
  className?: string;
  onChange?: (item: TenantItem) => void;
  labelClassName?: string;
  disabled?: boolean;
  queryParams?: Record<string, unknown>;
};

export default function TenantsCombobox<T extends FieldValues = FieldValues>({
  label,
  name,
  placeholder,
  form,
  className,
  onChange,
  labelClassName,
  disabled,
  queryParams,
}: DropdownProps<T>) {
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(name, formState);

  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
    select: (data) =>
      data.map((tenant) => ({
        id: tenant.id,
        description: tenant.lastName + ', ' + tenant.name,
        type: tenant.type,
        property: tenant.tenantRentals[0].property.name,
      })),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${className}`}>
          <FormLabel className={`font-normal ${labelClassName}`}>{label}</FormLabel>
          <ComboboxForm
            form={form}
            name={name}
            placeholder={isLoading ? 'Cargando...' : placeholder}
            field={field}
            filters={queryParams}
            data={tenants || []}
            onChange={onChange}
            isLoading={isLoading}
            disabled={disabled}
          />
          <div
            className={`relative transition-all duration-300 ease-in-out ${fieldState.invalid ? 'opacity-100' : 'opacity-0'}`}
          >
            <FormMessage className='absolute -top-1 font-normal' />
          </div>
        </FormItem>
      )}
    />
  );
}
