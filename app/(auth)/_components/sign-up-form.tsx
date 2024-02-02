"use client";

import { createUser } from "@/app/(auth)/_actions/user";
import { NewUserSchema, NewUserType } from "@/app/(auth)/_zodSchema";
import { FormInput } from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const SignUpForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<NewUserType>({
    resolver: zodResolver(NewUserSchema),
    defaultValues: {
      email: "",
      password: "",
      password2: "",
    },
  });

  const onSubmit = async (values: NewUserType) => {
    const { success, data } = await createUser(values);
    if (success) {
      toast({ title: "Success", description: "User Created successfully" });
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
