import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios.config";
import { isAxiosError } from "axios";

interface RoleState {
  roles: any[];
  isFetchingRoles: boolean;
  isSubmitting: boolean;
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  actions: {
    getRoles: (
      params: { page?: number; limit?: number; search?: string },
      onSuccess?: () => void
    ) => Promise<void>;
    addRole: (
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    updateRole: (
      roleId: string,
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
  };
}

interface SetFunction {
  (
    state: Partial<RoleState> | ((state: RoleState) => Partial<RoleState>)
  ): void;
}

const actions = (set: SetFunction) => ({
  getRoles: async (
    params: { page?: number; limit?: number; search?: string },
    onSuccess?: () => void
  ) => {
    set({ isFetchingRoles: true });
    try {
      const response = await axiosInstance.get(`/roles`, { params });
      const roles = response?.data?.data?.roles;

      set((state: RoleState) => ({
        ...state,
        roles,
        isFetchingRoles: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isFetchingRoles: false });
      toast.error("Failed to fetch roles");
    }
  },

  addRole: async (data: Record<string, any>, onSuccess?: () => void) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.post(`/roles`, data);

      set((state: RoleState) => ({
        ...state,
        isSubmitting: false,
      }));

      toast.success("Role added successfully");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add role");
      } else {
        toast.error("Failed to add role");
      }
    }
  },

  updateRole: async (
    roleId: string,
    data: Record<string, any>,
    onSuccess?: () => void
  ) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.put(`/roles/${roleId}`, data);
      const updatedRole = response?.data?.data;

      set((state: RoleState) => ({
        ...state,
        roles: state.roles.map((role) =>
          role._id === roleId ? updatedRole : role
        ),
        isSubmitting: false,
      }));

      toast.success("Role updated successfully");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update role");
      } else {
        toast.error("Failed to update role");
      }
    }
  },
});

// Create Zustand Store with type checking for state
export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  pagination: {
    totalCount: 0,
    totalPages: 0,
    currentPage: 0,
    perPage: 0,
  },
  isFetchingRoles: false,
  isSubmitting: false,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useRoleActions = () => useRoleStore((state) => state.actions);
