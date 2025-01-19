import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";

interface EditLeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    _id: string;
    name: string;
    defaultBalance: number;
  }) => Promise<void>;
  leaveType: { _id: string; name: string; defaultBalance: number };
  isSubmitting: boolean;
}

export default function EditLeaveTypeModal({
  isOpen,
  onClose,
  onSubmit,
  leaveType,
  isSubmitting,
}: EditLeaveTypeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ _id: string; name: string; defaultBalance: number }>({
    defaultValues: {
      _id: leaveType._id,
      name: leaveType.name,
      defaultBalance: leaveType.defaultBalance,
    },
  });

  const handleFormSubmit = async (data: {
    _id: string;
    name: string;
    defaultBalance: number;
  }) => {
    await onSubmit({
      _id: data._id,
      name: data.name,
      defaultBalance: data.defaultBalance,
    });
  };

  return (
    <Modal heading="Edit Leave Type" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Leave Name</label>
          <input
            type="text"
            {...register("name", { required: "Leave name is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Balance</label>
          <input
            type="number"
            {...register("defaultBalance", {
              required: "Balance is required",
              min: { value: 0, message: "Balance must be at least 0" },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.defaultBalance && (
            <p className="text-red-500 text-sm mt-1">
              {errors.defaultBalance.message}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
