import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios.config";
import { isAxiosError } from "axios";
import { LeaveSetFunction, LeaveState } from "@/types/leave.types";

const actions = (set: LeaveSetFunction) => ({
  addLeaveType: async (data: Record<string, any>, onSuccess?: () => void) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(`/leave/leave-type`, data);
      const leave = response?.data?.data;

      console.log("Leave Type Added:", leave);

      set((state: LeaveState) => ({
        ...state,
        isSubmitting: false,
      }));

      toast.success("Leave Type Added Successfully");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to add leave type"
        );
      } else {
        toast.error("Failed to add leave type");
      }
      throw error;
    }
  },

  getLeaveTypes: async (params?: Record<string, any>) => {
    set({ isFetching: true });
    try {
      const response = await axiosInstance.get(`/leave/leave-type`, {
        params,
      });
      const leaveTypes = response?.data?.data?.leaveTypes;

      console.log("Fetched Leaves:", leaveTypes);

      set((state: LeaveState) => ({
        ...state,
        leaveTypes,
        isFetching: false,
      }));
    } catch (error: unknown) {
      console.log(error);
      set({ isFetching: false });
      toast.error("Failed to fetch leave types");
    }
  },

  editLeaveType: async (
    leaveTypeId: string,
    data: Record<string, any>,
    onSuccess?: () => void
  ) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.put(
        `/leave/leave-type/${leaveTypeId}`,
        data
      );

      const leaveType = response?.data?.data?.leaveType;

      console.log("Leave type updated", leaveType);

      set((state: LeaveState) => ({
        ...state,
        isSubmitting: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      toast.error("Failed to fetch leave types");
    }
  },

  // Leave Requests

  applyForLeave: async (data: Record<string, any>, onSuccess?: () => void) => {
    const { startDate, endDate } = data;

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds between the two dates
    const timeDifference = end.getTime() - start.getTime();

    // Convert milliseconds to days (1000 ms * 60 seconds * 60 minutes * 24 hours)
    const daysTaken = timeDifference / (1000 * 3600 * 24) + 1; // Adding 1 to include both start and end dates

    // Add daysTaken to the request body
    const updatedData = {
      ...data,
      daysTaken,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };

    console.log(updatedData);

    set({ isFetching: true });
    try {
      const response = await axiosInstance.post(`/leave/leave-request`, data);
      const leaveBalance = response?.data?.data?.leaveBalance;
      console.log("Leave Request Made", leaveBalance);
      toast.success("Request Made");

      set((state: LeaveState) => ({
        ...state,
        leaveBalance,
        isFetching: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isFetching: false });
      toast.error("Failed to request for leave");
    }
  },

  // Leave Balance
  getLeaveBalance: async () => {
    set({ isFetching: true });
    try {
      const response = await axiosInstance.get(`/leave/balance`);
      const leaveBalance = response?.data?.data?.leaveBalance;
      console.log("Leave Balance Retrieved", leaveBalance);

      set((state: LeaveState) => ({
        ...state,
        leaveBalance,
        isFetching: false,
      }));
    } catch (error: unknown) {
      console.log(error);
      set({ isFetching: false });
      toast.error("Failed to fetch leave balance");
      throw error;
    }
  },
});

// Create Zustand Store with type checking for state
export const useLeaveStore = create<LeaveState>((set) => ({
  leaves: [],
  leaveTypes: [],
  leaveBalance: [],
  isFetching: false,
  isSubmitting: false,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useLeaveActions = () => useLeaveStore((state) => state.actions);
