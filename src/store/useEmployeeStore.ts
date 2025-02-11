import { create } from "zustand";
import axiosInstance from "@/lib/axios.config";
import { NavigateFunction } from "react-router-dom";
import {
  Employee,
  EmployeeSetFunction,
  EmployeeState,
} from "@/types/employee.types";

const actions = (set: EmployeeSetFunction) => ({
  setAuthEmployee: async (employee: Employee | null) => {
    set((state: EmployeeState) => ({
      ...state,
      employee,
    }));
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
});

// Create Zustand Store with type checking for state
export const useEmployeeStore = create<EmployeeState>((set) => ({
  employee: null,
  stats: {},
  isFetchingEmployee: false,
  isSubmitting: false,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useEmployeeActions = () =>
  useEmployeeStore((state) => state.actions);
