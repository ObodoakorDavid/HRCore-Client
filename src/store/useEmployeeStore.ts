import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios.config";
import { isAxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import { EmployeeSetFunction, EmployeeState } from "@/types/employee.types";

const actions = (set: EmployeeSetFunction) => ({
  employeeSignup: async (data: Record<string, any>, onSuccess?: () => void) => {
    set({ isSubmitting: true });
    try {
      console.log({ tenantId: data.tenantId });

      localStorage.setItem("tenant-id", data.tenantId);

      const response = await axiosInstance.post(`/employee/auth/signup`, data);
      const token = response?.data?.data?.token;
      const employee = response?.data?.data?.employee;

      console.log({ token, employee });

      localStorage.setItem("token", token);

      set((state: EmployeeState) => ({
        ...state,
        isSubmitting: false,
      }));

      toast.success(`SignUp successful`);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to sign up");
      } else {
        toast.error("Failed to sign up");
      }
    }
  },
  employeeSignin: async (data: Record<string, any>, onSuccess?: () => void) => {
    set({ isSubmitting: true });
    try {
      localStorage.setItem("tenant-id", data.tenantId);

      const response = await axiosInstance.post(`/employee/auth/signin`, data);
      const token = response?.data?.data?.token;
      const employee = response?.data?.data?.employee;
      const tenantId = response?.data?.data?.employee?.tenantId;

      localStorage.setItem("token", token);
      localStorage.setItem("tenant-id", tenantId);

      set((state: EmployeeState) => ({
        ...state,
        employee,
        isSubmitting: false,
      }));

      toast.success(`SignIn successful`);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to sign in");
      } else {
        toast.error("Failed to sign in");
      }
    }
  },
  getEmployee: async (navigate: NavigateFunction, onSuccess?: () => void) => {
    set({ isFetchingEmployee: true });
    try {
      const response = await axiosInstance.get(`/employee/auth`);
      const employee = response?.data?.data?.employee;
      const stats = response?.data?.data?.stats;

      set((state: EmployeeState) => ({
        ...state,
        employee,
        stats,
        isFetchingEmployee: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ employee: null, isFetchingEmployee: false });
      navigate(`/login`);
    } finally {
      set({ isFetchingEmployee: false });
    }
  },

  getEmployeeDetails: async (onSuccess?: () => void) => {
    try {
      const response = await axiosInstance.get(`/employee/auth`);
      const employee = response?.data?.data?.employee;
      const stats = response?.data?.data?.stats;

      set((state: EmployeeState) => ({
        ...state,
        employee,
        stats,
        isFetchingEmployee: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
    }
  },

  updateEmployeeProfile: async (
    data: Record<string, any>,
    onSuccess?: () => void
  ) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.put(`/employee/auth/profile`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const employee = response?.data?.data?.employee;
      
      set((state: EmployeeState) => ({
        ...state,
        employee,
        isSubmitting: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      set({ isSubmitting: false });
    }
  },
  logout: (navigate: NavigateFunction, onSuccess?: () => void) => {
    localStorage.removeItem("token");
    set((state: EmployeeState) => ({
      ...state,
      employee: null,
    }));
    navigate(`/login`);
    toast.success("Logged out successfully");

    if (onSuccess) {
      onSuccess();
    }
  },

  // Invites
  acceptInvite: async (
    data: { [key: string]: any },
    onSuccess?: () => void,
    onError?: (message: string) => void
  ) => {
    set({ isSubmitting: true });
    try {
      localStorage.setItem("tenant-id", data.tenantId);
      const response = await axiosInstance.put(
        `/employee/invite?token=${data.token}`,
        data
      );
      const responseData = response?.data?.data;

      console.log("Response Data:", responseData);

      set((state: EmployeeState) => ({
        ...state,
        isSubmitting: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
        if (onError) {
          onError(error.response?.data?.message);
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      set({ isSubmitting: false });
    }
  },

  // Forgot Password
  forgotPassword: async (email: string, onSuccess?: () => void) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.post(`/employee/auth/forgot-password`, {
        email,
      });

      toast.success("Password reset link sent to your email.");
      set({ isSubmitting: false });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to send reset email"
        );
      } else {
        toast.error("Failed to send reset email");
      }
    }
  },

  // Reset Password
  resetPassword: async (
    data: { token: string; password: string },
    onSuccess?: () => void
  ) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.post(`/employee/auth/reset-password`, data);

      toast.success("Password reset successfully.");
      set({ isSubmitting: false });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to reset password"
        );
      } else {
        toast.error("Failed to reset password");
      }
    }
  },
});

// Create Zustand Store with type checking for state
export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: {},
  stats: {},
  isFetchingEmployee: false,
  isSubmitting: false,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useEmployeeActions = () =>
  useEmployeeStore((state) => state.actions);
