import { useQuery } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';

import { getParties } from '@/lib/actions/parties';
import { PartyStatus, PartyType } from '@/lib/generated/prisma/client';
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
  status?: PartyStatus;
  type?: PartyType;
  enableClean?: boolean;
};

const PartiesDropdown = ({
  name,
  form,
  className,
  labelClassName,
  required,
  onChange,
  label,
  placeholder,
  status,
  type,
  enableClean,
}: DropdownProps) => {
  const labelName = label ?? 'Propiedad' + (required ? '*' : '');

  const { data: parties, isLoading } = useQuery({
    queryKey: ['parties', status, type],
    queryFn: () => getParties(status, type),
    select: (data) =>
      data.map((party: any) => ({
        id: party.id,
        description: party.lastName + ', ' + party.name,
        type: party.type,
      })),
  });

  if (isLoading) {
    return <DropdownLoadSkeleton label={labelName} className={className} />;
  }

  return (
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
  );
};

export { PartiesDropdown };
