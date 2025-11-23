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
  enableClean?: boolean;
};

const TypePartiesDropdown = ({
  name,
  form,
  className,
  labelClassName,
  required,
  onChange,
  label,
  placeholder,
  enableClean,
}: DropdownProps) => {
  const labelName = label ?? 'Rol' + (required ? '*' : '');

  const parties = [
    { id: 'TENANT', description: 'Inquilino' },
    { id: 'GUARANTOR', description: 'Garante' },
    { id: 'OWNER', description: 'Propietario' },
  ];

  return (
    <Suspense fallback={<DropdownLoadSkeleton label={labelName} />}>
      <Dropdown
        name={name}
        label={labelName}
        placeholder={placeholder || 'Seleccione...'}
        list={parties || []}
        form={form}
        className={className}
        labelClassName={labelClassName}
        onChange={onChange}
        enableClean={enableClean}
      />
    </Suspense>
  );
};

export { TypePartiesDropdown };
