import type { UseFormReturn } from 'react-hook-form';

import { useQuery } from '@tanstack/react-query';
import Dropdown from '@/components/ui/custom/dropdown';
import { getProperties } from '@/lib/actions/properties';
import DropdownLoadSkeleton from '@/components/ui/skeletons/dropdownLoadSkeleton';
import { PropertyStatus } from '@/lib/generated/prisma';

type DropdownProps = {
  name: string;
  form: UseFormReturn<any>;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  onChange?: (item: { id: string; description: string; status: PropertyStatus }) => void;
  label?: string;
  placeholder?: string;
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
        disabled: property.status !== 'ACTIVE',
      })),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  if (isLoading) {
    return <DropdownLoadSkeleton label={labelName} />;
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
    />
  );
};

export { PropertiesDropdown };
