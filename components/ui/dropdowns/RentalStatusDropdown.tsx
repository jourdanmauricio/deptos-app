import { Suspense } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import Dropdown from '@/components/ui/custom/dropdown';
import DropdownLoadSkeleton from '@/components/ui/skeletons/dropdownLoadSkeleton';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { UserRole } from '@/lib/generated/prisma/client';

type DropdownProps = {
  name: string;
  form: UseFormReturn<any>;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  onChange?: (item: { id: string; description: string }) => void;
  label?: string;
  placeholder?: string;
};

const RentalStatusDropdown = ({
  name,
  form,
  className,
  labelClassName,
  required,
  onChange,
  label,
  placeholder,
}: DropdownProps) => {
  const labelName = label ?? 'Rol' + (required ? '*' : '');

  const statuses = [
    { id: 'ACTIVE', description: 'Alquilado' },
    { id: 'EXPIRED', description: 'Finalizado' },
    { id: 'INACTIVE', description: 'Inactivo' },
    { id: 'CANCELLED', description: 'Cancelado' },
  ];

  return (
    <Suspense fallback={<DropdownLoadSkeleton label={labelName} />}>
      <Dropdown
        name={name}
        label={labelName}
        placeholder={placeholder || 'Seleccione...'}
        list={statuses || []}
        form={form}
        className={className}
        labelClassName={labelClassName}
        onChange={onChange}
      />
    </Suspense>
  );
};

export { RentalStatusDropdown };
