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
  reason: string;
}

export interface Leave {
  _id: string;
  employee: {
    name: string;
  };
  lineManager: {
    name: string;
  };
  leaveType: {
    _id: string;
    name: string;
  };
  status: string;
  duration: string;
  startDate: string;
  resumptionDate: string;
  reason: string;
  rejectionReason: string;
}
