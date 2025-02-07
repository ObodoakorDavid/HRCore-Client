import { AxiosError } from "axios";
import axiosInstance from "../lib/axios.config";
import { ApplyLeaveFormData } from "@/types/leave.types";

//Leave Requests
export const getAllLeaves = async () => {
  try {
    const response = await axiosInstance.get("/leave/leave-request");
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leaves"
      );
    }
    throw error;
  }
};

export const getLeaveDetail = async (leaveId: string | undefined) => {
  if (!leaveId) {
    throw new Error("Something went wrong");
  }

  try {
    const response = await axiosInstance.get(`/leave/leave-request/${leaveId}`);
    console.log({ data: response.data });

    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leaves"
      );
    }
    throw error;
  }
};

export const getEmployeeLeaves = async () => {
  try {
    const response = await axiosInstance.get("/leave/leave-request/employee");
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leaves"
      );
    }
    throw error;
  }
};

export const applyForLeave = async (data: ApplyLeaveFormData) => {
  try {
    const response = await axiosInstance.post("/leave/leave-request", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to apply for leave"
      );
    }
    throw error;
  }
};

export const fetchManagerLeaveRequest = async () => {
  try {
    const response = await axiosInstance.get("/leave/leave-request/manager");
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leave requests"
      );
    }
    throw error;
  }
};

export const updateLeaveRequest = async ({
  leaveId,
  status,
  reason,
}: {
  leaveId: string;
  status: "approved" | "rejected";
  reason: string;
}) => {
  try {
    const response = await axiosInstance.put(
      `/leave/leave-request/${leaveId}`,
      {
        status,
        reason,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update leave"
      );
    }
    throw error;
  }
};

// Leave Balance
export const getEmployeeLeaveBalance = async () => {
  try {
    const response = await axiosInstance.get(`/leave/balance`);
    const leaveBalance = response?.data?.data?.leaveBalance;
    return leaveBalance;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch leave balance"
      );
    }
    throw error;
  }
};
