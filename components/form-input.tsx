"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFormContext, useFormState } from "react-hook-form";

type FormInputProps = {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  className?: string;
};

export const FormInput = ({
  name,
  label,
  placeholder,
  className,
  type = "text",
}: FormInputProps) => {
  const { control } = useFormContext();
  const { errors } = useFormState();
  const isError = !!errors[name];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder ?? " "}
              type={type}
              {...field}
              className={cn(
                isError &&
                  "focus-visible:ring-none border-2 border-destructive",
                className
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
