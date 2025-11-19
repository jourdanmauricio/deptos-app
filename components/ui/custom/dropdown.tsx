import { cn } from '@/lib/utils';
import { XCircle } from 'lucide-react';
import { useEffect } from 'react';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useFormContext, type UseFormReturn } from 'react-hook-form';

type DropdownItem = {
  id: string;
  description: any;
  disabled?: boolean;
  className?: string;
};

type DropdownProps<T extends DropdownItem = DropdownItem> = {
  label: string;
  name: string;
  placeholder: string;
  list: T[];
  onChange?: (item: T) => void;
  form: UseFormReturn<any>;
  className?: string;
  disabled?: boolean;
  labelClassName?: string;
  enableClean?: boolean;
};

export default function Dropdown<T extends DropdownItem = DropdownItem>({
  label,
  name,
  placeholder,
  list,
  onChange,
  form,
  className,
  disabled = false,
  labelClassName,
  enableClean,
}: DropdownProps<T>) {
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(name, formState);

  const handleOnChange = (value: string) => {
    if (onChange && list) {
      const selectedItem = list.find((item) => item.id === value);
      if (selectedItem) {
        onChange(selectedItem);
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            <FormLabel className={`font-normal ${labelClassName}`}>{label}</FormLabel>
            {enableClean && field.value && (
              <div className='relative w-full'>
                <div
                  className='absolute -top-2 right-1 -translate-y-1/2 transform cursor-pointer'
                  onClick={() => field.onChange('')}
                >
                  <XCircle className='h-4 w-4 text-red-500' />
                </div>
              </div>
            )}
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                form.trigger(name);
                handleOnChange(value);
              }}
              value={field.value}
              name={name}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    `${
                      fieldState.invalid
                        ? 'border-destructive text-destructive focus:ring-destructive focus-visible:ring-destructive border'
                        : ''
                    }`,
                    'w-full'
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {list.length > 0 &&
                  list.map((el) => {
                    return (
                      <SelectItem
                        disabled={el.disabled}
                        value={el.id.toString()}
                        key={el.id}
                        className={el.className}
                      >
                        {typeof el.description !== 'function' ? el.description : el.description}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
            <div
              className={`relative transition-all duration-300 ease-in-out ${
                fieldState.invalid ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <FormMessage className='absolute -top-1 font-normal' />
            </div>
          </FormItem>
        );
      }}
    />
  );
}
