import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios.config";
import { isAxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";

interface EmployeeState {
  employee: any;
  isFetchingEmployee: boolean;
  isSubmitting: boolean;
  actions: {
    employeeSignup: (
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    employeeSignin: (
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    getEmployee: (
      navigate: NavigateFunction,
      onSuccess?: () => void
    ) => Promise<void>;
    acceptInvite: (
      data: { [key: string]: any },
      onSuccess?: () => void,
      onError?: (message: string) => void
    ) => Promise<void>;
    logout: (navigate: NavigateFunction, onSuccess?: () => void) => void;
  };
}

interface SetFunction {
  (
    state:
      | Partial<EmployeeState>
      | ((state: EmployeeState) => Partial<EmployeeState>)
  ): void;
}

const actions = (set: SetFunction) => ({
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

      toast.success(`SignUp successfull`);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to log in ");
      } else {
        toast.error("Failed to log in");
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

      localStorage.setItem("token", token);

      set((state: EmployeeState) => ({
        ...state,
        employee,
        isSubmitting: false,
      }));

      toast.success(`SignIn successfull`);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to log in ");
      } else {
        toast.error("Failed to log in");
      }
    }
  },
  getEmployee: async (navigate: NavigateFunction, onSuccess?: () => void) => {
    set({ isFetchingEmployee: true });
    try {
      const response = await axiosInstance.get(`/employee/auth`);
      const employee = response?.data?.data?.employee;

      console.log("Employee Details:", employee);

      set((state: EmployeeState) => ({
        ...state,
        employee,
        isFetchingEmployee: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ employee: null, isFetchingEmployee: false });
      const tenantId = localStorage.getItem("tenant-id");
      navigate(`/${tenantId}/signin`);
    } finally {
      set({ isFetchingEmployee: false });
    }
  },
  logout: (navigate: NavigateFunction, onSuccess?: () => void) => {
    localStorage.removeItem("token");
    set((state: EmployeeState) => ({
      ...state,
      employee: null,
    }));
    const tenantId = localStorage.getItem("tenant-id");
    navigate(`/${tenantId}/signin`);
    toast.success("Logged out successfully");

    if (onSuccess) {
      onSuccess();
    }
  },

  //Invites
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
});

// Create Zustand Store with type checking for state
export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: {},
  isFetchingEmployee: false,
  isSubmitting: false,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useEmployeeActions = () =>
  useEmployeeStore((state) => state.actions);
