import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";

interface EditLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { _id: string; name: string }) => Promise<void>;
  isSubmitting: boolean;
  level: { _id: string; name: string };
}

export default function EditLevelModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  level,
}: EditLevelModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ _id: string; name: string }>({
    defaultValues: { _id: level._id, name: level.name },
  });

  const handleFormSubmit = async (data: { _id: string; name: string }) => {
    await onSubmit(data);
  };

  return (
    <Modal heading="Edit Level" isOpen={isOpen} onClose={onClose}>
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
