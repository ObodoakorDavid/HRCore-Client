export interface TenantState {
  tenant: any | null;
  isFetchingTenant: boolean;
  actions: {
    setTenant: (tenant: any) => Promise<void>;
  };
}

export interface TenantSetFunction {
  (
    state: Partial<TenantState> | ((state: TenantState) => Partial<TenantState>)
  ): void;
}
