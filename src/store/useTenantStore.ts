import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios.config";
import { isAxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import { TenantSetFunction, TenantState } from "@/types/tenant.types";

const actions = (set: TenantSetFunction) => ({
  validateTenant: async (tenantId: string, onSuccess?: () => void) => {
    set({ isFetchingTenant: true });
    try {
      const response = await axiosInstance.get(`/tenant/${tenantId}`);
      const tenant = response?.data?.data;

      console.log("Tenant Details:", tenant);

      set((state: TenantState) => ({
        ...state,
        isFetchingTenant: false,
      }));

      toast.success(`Tenant ID validated successfully!`);

      if (onSuccess) {
        onSuccess();
      }
      return tenant;
    } catch (error: unknown) {
      console.log(error);
      set({ isFetchingTenant: false }); // If error, reset tenant and stop fetching
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to validate id");
      } else {
        toast.error("Failed to validate Id");
      }
    } finally {
      set({ isFetchingTenant: false }); // Reset loading state regardless of success/failure
    }
  },

  tenantLogin: async (data: Record<string, any>, onSuccess?: () => void) => {
    set({ isFetchingTenant: true });
    try {
      const response = await axiosInstance.post(`/tenant/auth/signin`, data);
      const token = response?.data?.data?.token;
      const tenant = response?.data?.data?.tenant;

      console.log({ token, tenant });

      localStorage.setItem("token", token);
      localStorage.setItem("tenant-id", tenant._id);

      set((state: TenantState) => ({
        ...state,
        isFetchingTenant: false,
      }));

      toast.success(`Logged in successfully!`);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ tenant: null, isFetchingTenant: false }); // If error, reset tenant and stop fetching
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to log in tenant");
      } else {
        toast.error("Failed to log in tenant");
      }
    } finally {
      set({ isFetchingTenant: false }); // Reset loading state regardless of success/failure
    }
  },

  getTenant: async (navigate: NavigateFunction, onSuccess?: () => void) => {
    set({ isFetchingTenant: true });
    try {
      const response = await axiosInstance.get(`/tenant/auth`);
      const tenant = response?.data?.data;

      console.log("Tenant Details:", tenant);

      set((state: TenantState) => ({
        ...state,
        tenant,
        isFetchingTenant: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      navigate("/tenant/login");
    } finally {
      set({ isFetchingTenant: false });
    }
  },

  sendInviteLink: async (
    data: { [key: string]: any },
    onSuccess?: () => void
  ) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(`/employee/invite`, data);
      const responseData = response?.data?.data;

      console.log("Response Data:", responseData);

      set((state: TenantState) => ({
        ...state,
        isSubmitting: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed send invite");
      } else {
        toast.error("Failed to send invite");
      }
    } finally {
      set({ isSubmitting: false });
    }
  },

  getAllLinks: async (
    params: {
      page?: number | string;
      limit?: number | string;
      [key: string]: any;
    } = {},
    onSuccess?: () => void
  ) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/tenant/link`, { params });
      const links = response?.data?.data?.links;

      console.log("All Links:", links);
      console.log({ data: response?.data?.data });

      set((state: TenantState) => ({
        ...state,
        invites: links,
        isLoading: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch links");
      } else {
        toast.error("Failed to fetch links");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getAllEmployees: async (
    params: {
      page?: number | string;
      limit?: number | string;
      [key: string]: any;
    } = {},
    onSuccess?: () => void
  ) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/employee`, { params });
      const employees = response?.data?.data?.employees;
      console.log({ data: response?.data?.data });

      set((state: TenantState) => ({
        ...state,
        employees,
        isLoading: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch links");
      } else {
        toast.error("Failed to fetch links");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  bulkInvite: async (data: { file: File }, onSuccess?: () => void) => {
    set({ isSubmitting: true });
    const formData = new FormData();
    formData.append("file", data.file);
    try {
      const response = await axiosInstance.post(
        `/employee/bulk-invite`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const message = response.data?.message;
      toast.success(message);
      // const employees = response?.data?.data?.employees;
      // console.log({ data: response?.data?.data });

      set((state: TenantState) => ({
        ...state,
        // employees,
        isSubmitting: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to invite");
      } else {
        toast.error("Failed to invite");
      }
    } finally {
      set({ isSubmitting: false });
    }
  },

  // Forgot Password
  forgotPassword: async (email: string, onSuccess?: () => void) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(
        `/tenant/auth/forgot-password`,
        { email }
      );

      console.log("Forgot Password Response:", response?.data);
      toast.success("Password reset link sent successfully!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to send password reset link"
        );
      } else {
        toast.error("Failed to send password reset link");
      }
    } finally {
      set({ isSubmitting: false });
    }
  },
  // Reset Password
  resetPassword: async (
    data: { token: string; password: string },
    onSuccess?: () => void
  ) => {
    set({ isSubmitting: true });
    try {
      axiosInstance.post(`/tenant/auth/reset-password`, data);

      toast.success("Password reset successfully!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to reset password"
        );
      } else {
        toast.error("Failed to reset password");
      }
    } finally {
      set({ isSubmitting: false });
    }
  },
});

// Create Zustand Store with type checking for state
export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  invites: [{}],
  employees: [{}],
  isLoading: false,
  isFetchingTenant: false,
  isSubmitting: false,
  pagination: {
    totalCount: 0,
    totalPages: 0,
    currentPage: 0,
    perPage: 0,
  },
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useTenantActions = () => useTenantStore((state) => state.actions);
