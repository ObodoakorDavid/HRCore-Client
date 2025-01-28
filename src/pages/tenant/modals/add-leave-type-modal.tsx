import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import axiosInstance from "@/lib/axios.config";

interface AddLeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    defaultBalance: number;
    levelId: string;
  }) => Promise<void>;
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
    setValue,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<{ name: string; defaultBalance: number; levelId: string }>();

  const handleFormSubmit = async (data: {
    name: string;
    defaultBalance: number;
    levelId: string;
  }) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleFetchOptions = async (search: string) => {
    try {
      const response = await axiosInstance.get(
        `/level?search=${encodeURIComponent(search)}&limit=5`
      );

      const levels = response?.data?.data?.levels;

      return levels?.map((item: { _id: string; name: string }) => ({
        value: item._id,
        label: item.name,
      }));
    } catch {
      return [];
    }
  };

  return (
    <Modal heading="Add Leave Type" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Leave Name */}
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

        {/* Default Balance */}
        <div className="mb-4">
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

        {/* Searchable Dropdown for Level */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Level</label>
          <SearchableDropdown
            placeholder="Search and select a Level"
            fetchOptions={handleFetchOptions}
            onChange={(value) => {
              console.log("Selected Level ID:", value);
              setValue("levelId", value);
              clearErrors(["levelId"]);
            }}
          />
          <input
            type="text"
            {...register("levelId", {
              required: "Level is required",
            })}
            className="hidden"
          />

          {errors.levelId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.levelId?.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
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
