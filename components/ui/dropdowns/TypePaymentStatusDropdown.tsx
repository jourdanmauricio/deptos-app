import { Suspense } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import Dropdown from '@/components/ui/custom/dropdown';
import DropdownLoadSkeleton from '@/components/ui/skeletons/dropdownLoadSkeleton';
import { paymentStatusList } from '@/shared/constanst';

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

const TypePaymentStatusDropdown = ({
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

  return (
    <Suspense fallback={<DropdownLoadSkeleton label={labelName} />}>
      <Dropdown
        name={name}
        label={labelName}
        placeholder={placeholder || 'Seleccione...'}
        list={paymentStatusList || []}
        form={form}
        className={className}
        labelClassName={labelClassName}
        onChange={onChange}
        enableClean={enableClean}
      />
    </Suspense>
  );
};

export { TypePaymentStatusDropdown };
