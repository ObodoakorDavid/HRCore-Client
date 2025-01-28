import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Modal } from "@/components/modal";
import { useEffect, useState } from "react";
import { useLeaveActions, useLeaveStore } from "@/store/useLeaveStore";

// Define types for documents
interface Document {
  _id: string;
  url: string;
  fileType: "image" | "document";
}

export default function EmployeeProfile() {
  const { employee } = useEmployeeStore();
  const { getEmployeeDetails } = useEmployeeActions();
  const { leaveBalance } = useLeaveStore();
  const { getLeaveBalance } = useLeaveActions();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    getLeaveBalance();
    getEmployeeDetails();
  }, [getEmployeeDetails, getLeaveBalance]);

  const onClose = () => setIsOpen(false);

  const handleDownload = (url: string) => {
    // Trigger download by creating an anchor tag programmatically
    const link = document.createElement("a");
    link.href = url;
    link.download = url; // Optional: Set the filename based on the URL
    link.click();
  };

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-start">Employee Profile</h1>
      <div className="flex justify-end gap-4 my-4">
        {/* <Button>Change Password</Button> */}

        <Link to={"/dashboard/employee/profile/update"}>
          <Button>Update Profile</Button>
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 text-start">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="text-gray-600">
            <span className="font-semibold">Name: </span>
            {employee.name ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Email: </span> {employee?.email}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Job Role: </span>
            {employee?.jobRole ?? "N/A"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Level: </span>
            <span className="capitalize">
              {employee?.levelId?.name ?? "N/A"}
            </span>
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Line Manger: </span>
            {(employee?.lineManager?.name || employee?.lineManager?.email) ??
              "N/A"}
          </p>
        </div>

        {/* Leave Balance Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Leave Balances</h2>
          <ul>
            {leaveBalance && leaveBalance.length > 0 ? (
              leaveBalance.map((balance: any, index: number) => (
                <li key={index} className="mb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold capitalize text-gray-600">
                      {balance.leaveTypeDetails?.name ?? "N/A"}
                    </span>
                    <span>{balance.balance ?? 0} days</span>
                  </div>
                </li>
              ))
            ) : (
              <p>No leave balances available.</p>
            )}
          </ul>
        </div>

        {/* Documents Section */}
        {employee?.documents?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>
            <ul>
              {employee.documents.map((doc: Document, index: number) => (
                <li key={doc._id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {doc.fileType === "image" ? (
                          <img
                            src={doc.url}
                            alt={`Document ${index + 1}`}
                            className="w-24 h-24 object-cover"
                          />
                        ) : (
                          <span className="underline">
                            {doc.url.split("/").pop()}
                          </span>
                        )}
                      </a>
                    </div>
                    <Button
                      onClick={() => handleDownload(doc.url)}
                      className="ml-4"
                    >
                      Download
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Modal heading="Change Password" isOpen={isOpen} onClose={onClose}>
        <p>Hello</p>
      </Modal>
    </div>
  );
}
