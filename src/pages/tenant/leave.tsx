import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddLeaveTypeModal from "./modals/add-leave-type-modal";
import EditLeaveTypeModal from "./modals/edit-leave-type-modal";
import { useLeaveActions, useLeaveStore } from "@/store/useLeaveStore";

interface LeaveType {
  _id: string;
  name: string;
  defaultBalance: number;
}

export default function LeaveTypes() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(
    null
  );

  const { leaveTypes, isSubmitting } = useLeaveStore();
  const { addLeaveType, getLeaveTypes, editLeaveType } = useLeaveActions();

  useEffect(() => {
    getLeaveTypes();
  }, [getLeaveTypes]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedLeaveType(null);
    setIsEditModalOpen(false);
  };

  const handleAddLeaveType = async (data: Omit<LeaveType, "_id">) => {
    await addLeaveType(data, () => {
      closeAddModal();
      getLeaveTypes();
    });
  };

  const handleEditLeaveType = async (data: LeaveType) => {
    console.log(data);

    await editLeaveType(data._id, data, () => {
      closeEditModal();
      getLeaveTypes();
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Leave Types</h1>
        <Button onClick={openAddModal}>
          <PlusCircle size={16} className="mr-2" />
          Add Leave Type
        </Button>
      </div>

      <table className="min-w-full bg-white border rounded-md shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border">Leave Name</th>
            <th className="text-left p-2 border">Balance</th>
            <th className="text-left p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveTypes.map((leaveType: any) => (
            <tr key={leaveType._id} className="hover:bg-gray-50">
              <td className="text-left p-2 border">{leaveType.name}</td>
              <td className="text-left p-2 border">
                {leaveType.defaultBalance}
              </td>
              <td className="text-left p-2 border flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(leaveType)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddLeaveTypeModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddLeaveType}
        isSubmitting={isSubmitting}
      />

      {selectedLeaveType && (
        <EditLeaveTypeModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={handleEditLeaveType}
          leaveType={selectedLeaveType}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
