import { useQuery } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';

import { getParties } from '@/lib/actions/parties';
import { PartyType } from '@/lib/generated/prisma/client';
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
  typePartie?: PartyType;
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
  typePartie,
  enableClean,
}: DropdownProps) => {
  const labelName = label ?? 'Propiedad' + (required ? '*' : '');

  const { data: parties, isLoading } = useQuery({
    queryKey: ['parties'],
    queryFn: getParties,
    select: (data) =>
      data.map((party: any) => ({
        id: party.id,
        description: party.lastName + ', ' + party.name,
        type: party.type,
      })),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Si typePartie es undefined, mostrar todas las propiedades
  const filteredParties = typePartie
    ? parties?.filter((party: any) => party.type === (typePartie as PartyType))
    : parties;

  if (isLoading) {
    return <DropdownLoadSkeleton label={labelName} />;
  }

  return (
    <Dropdown
      name={name}
      label={labelName}
      placeholder={placeholder || 'Seleccione...'}
      list={filteredParties || []}
      form={form}
      className={className}
      labelClassName={labelClassName}
      onChange={onChange}
      enableClean={enableClean}
    />
  );
};

export { PartiesDropdown };
