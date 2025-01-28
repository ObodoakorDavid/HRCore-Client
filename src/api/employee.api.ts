import { AxiosError } from "axios";
import axiosInstance from "../lib/axios.config";

// Define the shape of the data expected for the acceptInvite request
// interface AcceptInvitePayload {
//   tenantId: string;
//   token: string;
// }

// Define the shape of the response from the API
// interface AcceptInviteResponse {
//   success: boolean;
//   message?: string;
//   data?: {
//     user: { userId: string; email: string; tenantId: string };
//   };
// }

export const acceptInvite = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/invite/accept`, payload);

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



// Other API functions can be added here
// Example:
// export const getEmployeeDetails = async (employeeId: string) => { ... };
// export const updateEmployeeProfile = async (payload: EmployeeProfilePayload) => { ... };
