import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";

interface AddLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => Promise<void>;
  isSubmitting: boolean;
}

export default function AddLevelModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AddLevelModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const handleFormSubmit = async (data: { name: string }) => {
    await onSubmit(data);
  };

  return (
    <Modal heading="Add Level" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Level Name</label>
          <input
            type="text"
            {...register("name", { required: "Level name is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Level"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
