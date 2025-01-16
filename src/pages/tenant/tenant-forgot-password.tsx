import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTenantActions, useTenantStore } from "@/store/useTenantStore";
import { Link, useNavigate } from "react-router-dom";

interface ForgotPasswordFormInputs {
  email: string;
}

export default function TenantForgotPassword() {
  const { isSubmitting } = useTenantStore();
  const { forgotPassword } = useTenantActions();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    await forgotPassword(data.email, () => {
      navigate("/tenant/login");
    });
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-center mb-4">Forgot Password</h1>
        <form className="text-start" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Requesting..." : "Request Password Reset"}
          </Button>
          <div className="py-4 text-center">
            <Link to="/tenant/login" className="font-semibold underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
