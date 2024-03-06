"use client";

import { updateUserPaid } from "@/actions/user.actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { IsPaidFormData, IsPaidFormSchema } from "@/zodSchemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useForm } from "react-hook-form";

export const PaidForm = ({
  userId,
  isPaid,
}: {
  userId: string;
  isPaid: boolean;
}) => {
  const { toast } = useToast();
  const form = useForm<IsPaidFormData>({
    resolver: zodResolver(IsPaidFormSchema),
    defaultValues: {
      userId,
      isPaid,
    },
  });

  const onSubmit = async (values: IsPaidFormData) => {
    const resp = await updateUserPaid(values);
    if (resp.success) {
      toast({ title: "Success", description: "Is Paid flag updated" });
    } else
      toast({
        title: "Error",
        description: "Error updating paid flag",
        variant: "destructive",
      });
  };

  return (
    <Form {...form}>
      <form className="p-0 m-0 leading-none">
        <input type="hidden" name="userId" value={userId} />
        <FormField
          control={form.control}
          name="isPaid"
          render={({ field }) => {
            const onChange = async (checked: CheckedState) => {
              field.onChange(checked);
              await onSubmit(form.getValues());
            };
            return (
              <FormItem className="p-0 m-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={onChange} />
                </FormControl>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};
