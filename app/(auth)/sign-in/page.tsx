import { SignInForm } from "@/app/(auth)/_components/sign-in-form";
import { ModalForm } from "@/components/modal-form";

const SignInPage = () => {
  return (
    <ModalForm
      title="Login"
      desc="Enter Credentials to your account."
      form={<SignInForm />}
      leftButton={{ href: "/forgot-password", title: "Forgot Password" }}
      rightButton={{ href: "/sign-up", title: "Don't have an account" }}
      social={true}
    />
  );
};

export default SignInPage;
