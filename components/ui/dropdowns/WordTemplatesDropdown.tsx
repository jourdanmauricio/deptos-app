import { useQuery } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';

import Dropdown from '@/components/ui/custom/dropdown';
import DropdownLoadSkeleton from '@/components/ui/skeletons/dropdownLoadSkeleton';
import { getWordTemplates } from '@/lib/actions/word-templates';

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

const WordTemplatesDropdown = ({
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
  const labelName = label ?? 'Template Word' + (required ? '*' : '');

  const { data: wordTemplates, isLoading } = useQuery({
    queryKey: ['wordTemplates'],
    queryFn: getWordTemplates,
    select: (data) =>
      data.map((wordTemplate) => ({
        id: wordTemplate.id.toString(),
        description: wordTemplate.name,
      })),
  });

  if (isLoading) {
    return <DropdownLoadSkeleton label={labelName} />;
  }

  return (
    <Dropdown
      name={name}
      label={labelName}
      placeholder={placeholder || 'Seleccione...'}
      list={wordTemplates || []}
      form={form}
      className={className}
      labelClassName={labelClassName}
      onChange={onChange}
      enableClean={enableClean}
    />
  );
};

export { WordTemplatesDropdown };
