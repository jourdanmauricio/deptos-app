import type { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import Dropdown from '@/components/ui/custom/dropdown';
import { PropertyStatus } from '@/lib/generated/prisma/client';
import { getProperties } from '@/lib/actions/properties';
import DropdownLoadSkeleton from '@/components/ui/skeletons/dropdownLoadSkeleton';
import { cn } from '@/lib/utils';

type DropdownProps = {
  name: string;
  form: UseFormReturn<any>;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  onChange?: (item: { id: string; description: string; status: PropertyStatus }) => void;
  label?: string;
  placeholder?: string;
  filterStatus?: boolean;
  selectValue?: 'FIRST' | 'LAST' | undefined;
  disabled?: boolean;
};

const PropertiesDropdown = ({
  name,
  form,
  className,
  labelClassName,
  required,
  onChange,
  label,
  placeholder,
  filterStatus = true,
  selectValue,
  disabled = false,
}: DropdownProps) => {
  const labelName = label ?? 'Propiedad' + (required ? '*' : '');

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
    select: (data) =>
      data.map((property) => ({
        id: property.id,
        description: property.name,
        status: property.status as PropertyStatus,
        disabled: filterStatus && property.status !== 'ACTIVE',
      })),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  if (isLoading) {
    return <DropdownLoadSkeleton label={labelName} className={cn('space-y-0', className)} />;
  }

  return (
    <Dropdown<{ id: string; description: string; status: PropertyStatus }>
      name={name}
      label={labelName}
      placeholder={placeholder || 'Seleccione...'}
      list={properties || []}
      form={form}
      className={className}
      labelClassName={labelClassName}
      onChange={onChange}
      selectValue={selectValue}
      disabled={disabled}
    />
  );
};

export { PropertiesDropdown };
