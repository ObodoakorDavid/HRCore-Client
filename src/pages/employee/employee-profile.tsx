import { useEmployeeStore } from "@/store/useEmployeeStore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Modal } from "@/components/modal";
import { useState } from "react";

// Define types for documents
interface Document {
  _id: string;
  url: string;
  fileType: "image" | "document";
}

export default function EmployeeProfile() {
  const { employee } = useEmployeeStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClose = () => setIsOpen(false);

  const handleDownload = (url: string) => {
    // Trigger download by creating an anchor tag programmatically
    const link = document.createElement("a");
    link.href = url;
    link.download = url; // Optional: Set the filename based on the URL
    link.click();
  };

  console.log(employee);

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
