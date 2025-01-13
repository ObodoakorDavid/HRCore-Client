import { useNavigate, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Import Button component
import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";

interface RegisterFormInputs {
  password: string;
  confirmPassword: string;
}

export default function EmployeeRegister() {
  // Extracting route params
  const { tenantId, token, email } = useParams<{
    tenantId: string;
    token: string;
    email: string;
  }>();

  const { isSubmitting } = useEmployeeStore();
  const { employeeSignup } = useEmployeeActions();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    console.log("Form Data:", {
      tenantId,
      token,
      email,
      password: data.password,
    });

    const newData = {
      tenantId,
      token,
      email,
      password: data.password,
    };

    await employeeSignup(newData, () => {
      navigate(`/${tenantId}/signin`);
    });
  };

  const password = watch("password");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-center mb-4">
        Employee Registration
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-gray-100"
          />
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
        <div className="mb-4">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Loading" : "Register"}
        </Button>
      </form>
    </div>
  );
}
