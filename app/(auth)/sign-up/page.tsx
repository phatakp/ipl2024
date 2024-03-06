import { SignUpForm } from "@/app/(auth)/_components/sign-up-form";
import { ModalForm } from "@/components/modal-form";

const SignUpPage = () => {
  return (
    <ModalForm
      title="Create an Account"
      desc="Enter details for your account."
      form={<SignUpForm />}
      leftButton={{ href: "/", title: "Back to Home" }}
      rightButton={{ href: "/sign-in", title: "Already have an account" }}
      social={true}
    />
  );
};

export default SignUpPage;
