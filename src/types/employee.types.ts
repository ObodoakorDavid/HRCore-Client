import { NavigateFunction } from "react-router-dom";

export interface Employee {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  jobRole: string;
  isOnLeave: boolean;
  isAdmin: boolean;
  tenantId: {
    name: string;
    logo: string;
  };
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
  name: string | null;
  email: string;
  lineManager: string | null;
  isOnLeave: boolean;
  reliever: string | null;
  file: File | null;
  avatar: File | null;
}

export interface EmployeeState {
  employee: Employee | null;
  isFetchingEmployee: boolean;
  isSubmitting: boolean;
  stats: any;
  actions: {
    setAuthEmployee: (employee: Employee | null) => Promise<void>;
    getEmployee: (
      navigate: NavigateFunction,
      onSuccess?: () => void
    ) => Promise<void>;
    getEmployeeDetails: (onSuccess?: () => void) => Promise<void>;
  };
}

export interface EmployeeSetFunction {
  (
    state:
      | Partial<EmployeeState>
      | ((state: EmployeeState) => Partial<EmployeeState>)
  ): void;
}
