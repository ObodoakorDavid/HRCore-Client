import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"; // Adjust based on your shadcn setup
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useTenantActions } from "@/store/useTenantStore";
import { Link, useNavigate } from "react-router-dom";

type TenantIdFormInputs = {
  tenantId: string;
};

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function TenantLogin() {
  const [isTenantValid, setIsTenantValid] = useState(false);

  const navigate = useNavigate();

  const { validateTenant, tenantLogin } = useTenantActions();

  // Tenant ID Form
  const {
    register: registerTenant,
    handleSubmit: handleTenantSubmit,
    formState: { errors: tenantErrors, isSubmitting: isTenantSubmitting },
  } = useForm<TenantIdFormInputs>();

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginFormInputs>();

  const validateTenantId = async (data: TenantIdFormInputs) => {
    console.log(data.tenantId);

    try {
      await validateTenant(data.tenantId, () => {
        setIsTenantValid(true);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (data: LoginFormInputs) => {
    console.log("Login Data:", data);

    try {
      await tenantLogin(data, () => {
        navigate("/dashboard/tenant");
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Tenant Login</h2>

      {/* Tenant ID Input */}
      <form
        onSubmit={handleTenantSubmit(validateTenantId)}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="tenantId" className="block mb-1 font-medium">
            Tenant ID
          </Label>
          <Input
            id="tenantId"
            type="text"
            {...registerTenant("tenantId", {
              required: "Tenant ID is required",
            })}
            placeholder="Enter your Tenant ID"
            className="w-full"
          />
          {tenantErrors.tenantId && (
            <p className="text-red-500 text-sm mt-1">
              {tenantErrors.tenantId.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isTenantSubmitting || isTenantValid}
          className="w-full"
        >
          {isTenantSubmitting ? "Validating..." : "Validate Tenant ID"}
        </Button>
      </form>

      {/* Login Form */}
      {isTenantValid && (
        <form
          onSubmit={handleLoginSubmit(handleLogin)}
          className="space-y-4 mt-6"
        >
          <div>
            <Label htmlFor="email" className="block mb-1 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...registerLogin("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              placeholder="Enter your email"
              className="w-full"
            />
            {loginErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {loginErrors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="block mb-1 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...registerLogin("password", {
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 6 characters long",
                },
              })}
              placeholder="Enter your password"
              className="w-full"
            />
            {loginErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {loginErrors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoginSubmitting} className="w-full">
            {isLoginSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      )}
      <div className="pt-4 text-end">
        <Link to="/tenant/forgot-password" className="font-semibold underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
