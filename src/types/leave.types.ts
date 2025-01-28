export interface LeaveState {
  leaves: Record<string, any>[];
  leaveTypes: Record<string, any>[];
  leaveBalance: Record<string, any>[];
  isFetching: boolean;
  isSubmitting: boolean;
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
    //Leave blance
    getLeaveBalance: () => Promise<void>;

    //Leave Requests
    applyForLeave: (
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

export interface ApplyLeaveFormData {
  leaveTypeId: string;
  startDate: Date | string;
  resumptionDate: Date | string;
  duration: number;
  description: string;
}
