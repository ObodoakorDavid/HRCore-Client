// import { NavigateFunction } from "react-router-dom";

export interface LeaveState {
  leaves: Record<string, any>[]; // Array of leave records
  leaveTypes: Record<string, any>[]; // Array of leave records
  isFetching: boolean; // Indicates whether leaves are being fetched
  isSubmitting: boolean; // Indicates whether a leave request is being submitted
  actions: {
    addLeaveType: (
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    getLeaveTypes: (params?: Record<string, any>) => Promise<void>;
    editLeaveType: (
      leaveTypeId: string,
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    // requestLeave: (
    //   data: Record<string, any>,
    //   onSuccess?: () => void
    // ) => Promise<void>;
    // updateLeaveRequest: (
    //   data: { id: string; [key: string]: any },
    //   onSuccess?: () => void
    // ) => Promise<void>;
    // cancelLeaveRequest: (id: string, onSuccess?: () => void) => Promise<void>;
    // approveLeave: (id: string, onSuccess?: () => void) => Promise<void>;
    // rejectLeave: (
    //   id: string,
    //   reason?: string,
    //   onSuccess?: () => void
    // ) => Promise<void>;
  };
}

export interface LeaveSetFunction {
  (
    state: Partial<LeaveState> | ((state: LeaveState) => Partial<LeaveState>)
  ): void;
}
