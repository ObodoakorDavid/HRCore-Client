import { NavigateFunction } from "react-router-dom";

export interface TenantState {
  tenant: any | null;
  invites: [{ [key: string]: any }];
  employees: any[];
  isFetchingTenant: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
  stats: any;
  actions: {
    validateTenant: (tenantId: string, onSuccess?: () => void) => Promise<void>;
    tenantLogin: (
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    getTenant: (
      navigate: NavigateFunction,
      onSuccess?: () => void
    ) => Promise<void>;
    sendInviteLink: (
      data: { [key: string]: any },
      onSuccess?: () => void
    ) => Promise<void>;
    getAllLinks: (
      params: {
        page?: number | string;
        limit?: number | string;
        [key: string]: any;
      },
      onSuccess?: () => void
    ) => Promise<void>;
    getAllEmployees: (
      params: {
        page?: number | string;
        limit?: number | string;
        [key: string]: any;
      },
      onSuccess?: () => void
    ) => Promise<void>;
    bulkInvite: (data: { file: File }, onSuccess?: () => void) => Promise<void>;
    forgotPassword: (email: string, onSuccess?: () => void) => Promise<void>;
    resetPassword: (
      data: { token: string; password: string },
      onSuccess?: () => void
    ) => Promise<void>;
  };
}

export interface TenantSetFunction {
  (
    state: Partial<TenantState> | ((state: TenantState) => Partial<TenantState>)
  ): void;
}
