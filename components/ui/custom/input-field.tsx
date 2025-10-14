import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { HTMLInputTypeAttribute } from "react";
import { useFormContext, UseFormReturn } from "react-hook-form";

type InputFieldProps = {
  type?: HTMLInputTypeAttribute;
  label: string;
  name: string;
  placeholder: string;
  form: UseFormReturn<any>;
  className?: string; // TO-DO: renombrar a formItemClassName
  labelClassName?: string;
  disabled?: boolean;
  maxLength?: number;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  enableClean?: boolean;
  readOnly?: boolean;
  errorClassName?: string;
  icon?: React.ReactNode;
  iconOnClick?: () => void;
  autoFocus?: boolean;
};

const InputField = ({
  type,
  label,
  name,
  placeholder,
  form,
  className,
  labelClassName,
  disabled = false,
  maxLength,
  onChange,
  onKeyDown,
  enableClean,
  readOnly,
  errorClassName,
  icon,
  iconOnClick,
  autoFocus,
}: InputFieldProps) => {
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(name, formState);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={`text-sm font-normal ${labelClassName}`}>
            {label}
          </FormLabel>
          {enableClean && field.value && (
            <div className="relative w-full">
              <div
                className="absolute right-3 top-5 -translate-y-1/2 transform cursor-pointer"
                onClick={() => field.onChange("")}
              >
                <X className="h-4 w-4 text-neutral-500" />
              </div>
            </div>
          )}
          <FormControl>
            <div className="relative">
              {icon && (
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform z-10"
                  onClick={iconOnClick}
                >
                  {icon}
                </div>
              )}
              <Input
                type={type ?? "text"}
                disabled={disabled}
                readOnly={readOnly}
                tabIndex={readOnly ? -1 : 0}
                maxLength={maxLength}
                placeholder={placeholder}
                autoFocus={autoFocus}
                className={`${
                  fieldState.invalid
                    ? "border border-destructive text-destructive placeholder:text-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...field}
                onChange={(e) => {
                  if (onChange) {
                    field.onChange(onChange(e));
                    // onChange(e);
                  } else {
                    field.onChange(e);
                  }
                }}
                onKeyDown={onKeyDown}
              />
            </div>
          </FormControl>
          <div
            className={cn(
              `relative transition-all duration-300 ease-in-out ${
                fieldState.invalid ? "opacity-100" : "opacity-0"
              }`,
              errorClassName
            )}
          >
            <FormMessage className="absolute top-0.5 font-normal" />
          </div>
        </FormItem>
      )}
    />
  );
};

export { InputField };
