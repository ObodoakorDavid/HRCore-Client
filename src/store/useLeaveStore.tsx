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

  //   approveLeave: async (
  //     leaveId: string,
  //     onSuccess?: () => void,
  //     onError?: (message: string) => void
  //   ) => {
  //     set({ isSubmitting: true });
  //     try {
  //       const response = await axiosInstance.put(`/leave/approve/${leaveId}`);
  //       const updatedLeave = response?.data?.data;

  //       console.log("Approved Leave:", updatedLeave);

  //       set((state: LeaveState) => ({
  //         ...state,
  //         isSubmitting: false,
  //       }));

  //       toast.success("Leave approved successfully.");
  //       if (onSuccess) {
  //         onSuccess();
  //       }
  //     } catch (error: unknown) {
  //       console.log(error);
  //       set({ isSubmitting: false });
  //       if (isAxiosError(error)) {
  //         toast.error(error.response?.data?.message || "Failed to approve leave");
  //         if (onError) {
  //           onError(error.response?.data?.message);
  //         }
  //       } else {
  //         toast.error("Failed to approve leave");
  //       }
  //     }
  //   },

  //   rejectLeave: async (
  //     leaveId: string,
  //     onSuccess?: () => void,
  //     onError?: (message: string) => void
  //   ) => {
  //     set({ isSubmitting: true });
  //     try {
  //       const response = await axiosInstance.put(`/leave/reject/${leaveId}`);
  //       const updatedLeave = response?.data?.data;

  //       console.log("Rejected Leave:", updatedLeave);

  //       set((state: LeaveState) => ({
  //         ...state,
  //         isSubmitting: false,
  //       }));

  //       toast.success("Leave rejected successfully.");
  //       if (onSuccess) {
  //         onSuccess();
  //       }
  //     } catch (error: unknown) {
  //       console.log(error);
  //       set({ isSubmitting: false });
  //       if (isAxiosError(error)) {
  //         toast.error(error.response?.data?.message || "Failed to reject leave");
  //         if (onError) {
  //           onError(error.response?.data?.message);
  //         }
  //       } else {
  //         toast.error("Failed to reject leave");
  //       }
  //     }
  //   },

  //   cancelLeave: async (leaveId: string, onSuccess?: () => void) => {
  //     set({ isSubmitting: true });
  //     try {
  //       await axiosInstance.delete(`/leave/cancel/${leaveId}`);

  //       console.log("Leave Canceled:", leaveId);

  //       set((state: LeaveState) => ({
  //         ...state,
  //         isSubmitting: false,
  //       }));

  //       toast.success("Leave canceled successfully.");
  //       if (onSuccess) {
  //         onSuccess();
  //       }
  //     } catch (error: unknown) {
  //       console.log(error);
  //       set({ isSubmitting: false });
  //       if (isAxiosError(error)) {
  //         toast.error(error.response?.data?.message || "Failed to cancel leave");
  //       } else {
  //         toast.error("Failed to cancel leave");
  //       }
  //     }
  //   },
});

// Create Zustand Store with type checking for state
export const useLeaveStore = create<LeaveState>((set) => ({
  leaves: [],
  leaveTypes: [],
  isFetching: false,
  isSubmitting: false,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useLeaveActions = () => useLeaveStore((state) => state.actions);
