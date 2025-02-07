import { NavigateFunction } from "react-router-dom";

export interface Employee {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  jobRole: string;
  isOnLeave: boolean;
  isAdmin: boolean;
  lineManager: Employee;
  reliever: Employee;
  levelId: {
    _id: string;
    name: string;
  };
  documents: [
    {
      _id: string;
      url: string;
      fileType: string;
    }
  ];
}

export interface UpdateEmployee {
  name: string;
  email: string;
  lineManager: string;
  isOnLeave: boolean;
  reliever: string;
  file: File | null;
  avatar: File | null;
}

export interface EmployeeState {
  // employee: any;
  employee: Employee | null;
  isFetchingEmployee: boolean;
  isSubmitting: boolean;
  stats: any;
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
    getEmployeeDetails: (onSuccess?: () => void) => Promise<void>;
    acceptInvite: (
      data: { [key: string]: any },
      onSuccess?: () => void,
      onError?: (message: string) => void
    ) => Promise<void>;
    updateEmployeeProfile: (
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    logout: (navigate: NavigateFunction, onSuccess?: () => void) => void;
    forgotPassword: (email: string, onSuccess?: () => void) => Promise<void>;
    resetPassword: (
      data: { token: string; password: string },
      onSuccess?: () => void
    ) => Promise<void>;
  };
}

export interface EmployeeSetFunction {
  (
    state:
      | Partial<EmployeeState>
      | ((state: EmployeeState) => Partial<EmployeeState>)
  ): void;
}
