import { ModalForm } from "@/components/modal-form";
import { ForgotPasswordForm } from "../_components/forgot-password-form";

const ForgotPasswordPage = () => {
  return (
    <ModalForm
      title="Forgot Password"
      desc="Create new password."
      form={<ForgotPasswordForm />}
      leftButton={{ href: "/", title: "Back to Home" }}
      rightButton={{ href: "/sign-in", title: "Login" }}
    />
  );
};

export default ForgotPasswordPage;
