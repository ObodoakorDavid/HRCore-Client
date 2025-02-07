import { AxiosError } from "axios";
import axiosInstance from "../lib/axios.config";
import { UpdateEmployee } from "@/types/employee.types";

export const getAllEmployees = async (
  params: {
    page?: number | string;
    limit?: number | string;
    [key: string]: any;
  } = {}
) => {
  try {
    const response = await axiosInstance.get(`/employee`, { params });
    const employees = response?.data?.data?.employees;
    const pagination = response?.data?.pagination;

    return { employees, pagination };
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
    throw error;
  }
};

export const getEmployeeDetails = async (employeeId: string | undefined) => {
  try {
    const response = await axiosInstance.get(`/employee/profile/${employeeId}`);
    const employee = response?.data?.data?.employee;
    return employee;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employee"
      );
    }
    throw error;
  }
};

export const getLoggedInEmployee = async () => {
  try {
    const response = await axiosInstance.get(`/employee/auth`);
    const employee = response?.data?.data?.employee;
    return employee;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch employee"
      );
    }
    throw error;
  }
};

export const updateEmployeeProfileAPI = async (
  data: Partial<UpdateEmployee>
) => {
  try {
    const response = await axiosInstance.put(`/employee/auth`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const employee = response?.data?.data?.employee;
    return employee;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
    throw error;
  }
};

export const acceptInvite = async (payload: {
  tenantId: string;
  token: string;
}) => {
  try {
    localStorage.setItem("tenant-id", payload.tenantId);
    const response = await axiosInstance.put(
      `/employee/invite?token=${payload.token}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to accept invite. Please try again."
      );
    }
    throw error;
  }
};

// Admins
// export const makeEmployeeAdminApi = async (
//   employeeId: string,
//   payload: { isAdmin: boolean }
// ) => {
//   try {
//     const response = await axiosInstance.put(
//       `/employee/${employeeId}/admin`,
//       payload
//     );

//     return response.data;
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       throw new Error(error.response?.data?.message || "Something went wrong");
//     }
//     throw error;
//   }
// };

export const updateEmployeeDetails = async (payload: any) => {
  console.log(payload);

  try {
    const response = await axiosInstance.put(
      `/employee/admin/employee/${payload.employeeId}`,
      payload
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update employee"
      );
    }
    throw error;
  }
};
