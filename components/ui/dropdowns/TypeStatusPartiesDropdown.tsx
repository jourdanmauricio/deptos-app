import { Suspense } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import Dropdown from '@/components/ui/custom/dropdown';
import { statusesPartiesList } from '@/shared/constanst';
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

const TypeStatusPartiesDropdown = ({
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
  const labelName = label ?? 'Estado' + (required ? '*' : '');

  return (
    <Suspense fallback={<DropdownLoadSkeleton label={labelName} />}>
      <Dropdown
        name={name}
        label={labelName}
        placeholder={placeholder || 'Seleccione...'}
        list={statusesPartiesList || []}
        form={form}
        className={className}
        labelClassName={labelClassName}
        onChange={onChange}
        enableClean={enableClean}
      />
    </Suspense>
  );
};

export { TypeStatusPartiesDropdown };
