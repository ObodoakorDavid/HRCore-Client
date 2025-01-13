import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios.config";
import { isAxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";

interface TenantState {
  tenant: any | null;
  invites: [{ [key: string]: any }];
  employees: [{ [key: string]: any }];
  isFetchingTenant: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  actions: {
    getTenant: (tenantId: string, onSuccess?: () => void) => Promise<void>;
    tenantLogin: (
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    getTenantDetails: (
      navigate: NavigateFunction,
      onSuccess?: () => void
    ) => Promise<void>;
    sendInviteLink: (
      data: { [key: string]: any },
      onSuccess?: () => void
    ) => Promise<void>;
    getAllLinks: (
      params: {
        page?: number | string;
        limit?: number | string;
        [key: string]: any;
      },
      onSuccess?: () => void
    ) => Promise<void>;
    getAllEmployees: (
      params: {
        page?: number | string;
        limit?: number | string;
        [key: string]: any;
      },
      onSuccess?: () => void
    ) => Promise<void>;
    bulkInvite: (data: { file: File }, onSuccess?: () => void) => Promise<void>;
  };
}

interface SetFunction {
  (
    state: Partial<TenantState> | ((state: TenantState) => Partial<TenantState>)
  ): void;
}

const actions = (set: SetFunction) => ({
  getTenant: async (tenantId: string, onSuccess?: () => void) => {
    console.log(tenantId);

    set({ isFetchingTenant: true });
    try {
      const response = await axiosInstance.get(`/tenant/${tenantId}`);
      const tenant = response?.data?.data;

      console.log("Tenant Details:", tenant);

      set((state: TenantState) => ({
        ...state,
        tenant,
        isFetchingTenant: false,
      }));

      localStorage.setItem("tenant-id", tenantId);
      toast.success(`Tenant ID ${tenantId} validated successfully!`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ tenant: null, isFetchingTenant: false }); // If error, reset tenant and stop fetching
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
      const response = await axiosInstance.post(`/tenant/signin`, data);
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

  getTenantDetails: async (
    navigate: NavigateFunction,
    onSuccess?: () => void
  ) => {
    set({ isFetchingTenant: true });
    try {
      const response = await axiosInstance.get(`/tenant`);
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
});

// Create Zustand Store with type checking for state
export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  invites: [{}],
  employees: [{}],
  isLoading: false,
  pagination: {
    totalCount: 0,
    totalPages: 0,
    currentPage: 0,
    perPage: 0,
  },
  isFetchingTenant: false,
  isSubmitting: false,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useTenantActions = () => useTenantStore((state) => state.actions);
