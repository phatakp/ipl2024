import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentPropsWithoutRef } from "react";
import { useFormContext } from "react-hook-form";

export type SelectOption = {
  label: string;
  value: string;
};

type FormSelectProps = ComponentPropsWithoutRef<"select"> & {
  label: string;
  isDisabled?: boolean;
  options: SelectOption[];
};

export const FormSelect = ({
  name,
  label,
  options,
  disabled,
  required = false,
}: FormSelectProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name!}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
            required={required}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option: SelectOption) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="capitalize"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
