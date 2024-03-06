"use client";

import { FormInput } from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { LoginFormData, LoginSchema } from "@/zodSchemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const SignInForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: LoginFormData) => {
    const values = LoginSchema.safeParse(formData);
    if (values.success) {
      const resp = await signIn("credentials", {
        ...values.data,
        redirect: false,
      });

      if (resp?.error)
        toast({
          title: "Error",
          description: "Invalid Credentials",
          variant: "destructive",
        });

      if (resp?.ok && !resp.error) {
        toast({ title: "Success", description: "You are logged in !!" });
        router.push("/dashboard");
      }
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6 mt-12" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput name="email" label="Email Address" type="email" />
        <FormInput name="password" label="Password" type="password" />

        <Button
          isLoading={form.formState.isSubmitting}
          type="submit"
          className="w-full my-16"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
