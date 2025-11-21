import { Suspense } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import Dropdown from '@/components/ui/custom/dropdown';
import DropdownLoadSkeleton from '@/components/ui/skeletons/dropdownLoadSkeleton';
import { paymentConcepts } from '@/shared/constanst';

type DropdownProps = {
  name: string;
  form: UseFormReturn<any>;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  onChange?: (item: { id: string; description: string }) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

const PaymentConceptsDropdown = ({
  name,
  form,
  className,
  labelClassName,
  required,
  onChange,
  label,
  placeholder,
  disabled = false,
}: DropdownProps) => {
  const labelName = label ?? 'Concepto' + (required ? '*' : '');

  return (
    <Suspense fallback={<DropdownLoadSkeleton label={labelName} />}>
      <Dropdown
        name={name}
        label={labelName}
        placeholder={placeholder || 'Seleccione...'}
        list={paymentConcepts || []}
        form={form}
        className={className}
        labelClassName={labelClassName}
        onChange={onChange}
        disabled={disabled}
      />
    </Suspense>
  );
};

export { PaymentConceptsDropdown };
