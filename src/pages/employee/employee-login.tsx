import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface SignInFormInputs {
  email: string;
  password: string;
}

export default function EmployeeLogin() {
  const { isSubmitting } = useEmployeeStore();
  const { employeeSignin } = useEmployeeActions();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    await employeeSignin({ ...data }, () => {
      navigate("/dashboard/employee");
    });
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-center mb-4"> Sign In</h1>
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
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <div className="py-4 text-end">
            <Link to="/forgot-password" className="font-semibold underline">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
