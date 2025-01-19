import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";

interface AddLeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; defaultBalance: number }) => Promise<void>;
  isSubmitting: boolean;
}

export default function AddLeaveTypeModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AddLeaveTypeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; defaultBalance: number }>();

  const handleFormSubmit = async (data: {
    name: string;
    defaultBalance: number;
  }) => {
    await onSubmit(data);
  };

  return (
    <Modal heading="Add Leave Type" isOpen={isOpen} onClose={onClose}>
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
            {isSubmitting ? "Adding..." : "Add Leave Type"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
