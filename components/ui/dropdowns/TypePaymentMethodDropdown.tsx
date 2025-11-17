import { Suspense } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import Dropdown from '@/components/ui/custom/dropdown';
import DropdownLoadSkeleton from '@/components/ui/skeletons/dropdownLoadSkeleton';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { UserRole } from '@/lib/generated/prisma';

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

const TypePaymentMethodDropdown = ({
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

  const paymentMethods = [
    { id: 'CASH', description: 'Efectivo' },
    { id: 'CHECK', description: 'Cheque' },
    { id: 'TRANSFER', description: 'Transferencia' },
    { id: 'CREDIT_CARD', description: 'Tarjeta de crédito' },
    { id: 'DEBIT_CARD', description: 'Tarjeta de débito' },
    { id: 'ONLINE', description: 'Online' },
    { id: 'OTHER', description: 'Otro' },
  ];

  return (
    <Suspense fallback={<DropdownLoadSkeleton label={labelName} />}>
      <Dropdown
        name={name}
        label={labelName}
        placeholder={placeholder || 'Seleccione...'}
        list={paymentMethods || []}
        form={form}
        className={className}
        labelClassName={labelClassName}
        onChange={onChange}
      />
    </Suspense>
  );
};

export { TypePaymentMethodDropdown };
