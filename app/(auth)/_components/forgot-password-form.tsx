"use client";

import { updatePassword } from "@/actions/user.actions";
import { FormInput } from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { RegisterFormData, RegisterSchema } from "@/zodSchemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      password2: "",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    const { success, data } = await updatePassword(values);
    if (success) {
      toast({ title: "Success", description: "Password Updated successfully" });
      router.push("/sign-in");
    } else
      toast({ title: "Error", description: `${data}`, variant: "destructive" });
  };

  return (
    <Form {...form}>
      <form className="space-y-6 mt-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput name="email" label="Email Address" type="email" />
        <FormInput name="password" label="Password" type="password" />
        <FormInput name="password2" label="Confirm Password" type="password" />

        <Button
          isLoading={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
