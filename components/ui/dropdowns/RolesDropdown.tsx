import { Suspense } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import Dropdown from '@/components/ui/custom/dropdown';
import DropdownLoadSkeleton from '@/components/ui/skeletons/dropdownLoadSkeleton';

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

const RolesDropdown = ({
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

  const roles = [
    { id: 'ADMIN', description: 'Administrador' },
    { id: 'USER', description: 'Usuario' },
  ];

  return (
    <Suspense fallback={<DropdownLoadSkeleton label={labelName} />}>
      <Dropdown
        name={name}
        label={labelName}
        placeholder={placeholder || 'Seleccione...'}
        list={roles || []}
        form={form}
        className={className}
        labelClassName={labelClassName}
        onChange={onChange}
      />
    </Suspense>
  );
};

export { RolesDropdown };
