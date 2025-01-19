import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/modal";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
  isSubmitting: boolean;
}

export default function AddRoleModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: RoleModalProps) {
  const { register, handleSubmit, formState } = useForm<{
    name: string;
    description?: string;
  }>();
  const { errors } = formState;

  const handleFormSubmit = (data: { name: string; description?: string }) => {
    onSubmit(data);
  };

  return (
    <Modal heading="Add Role" isOpen={isOpen} onClose={onClose}>
      <h2>Add Role</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Role Name
          </label>
          <Input
            id="name"
            {...register("name", { required: "Role name is required" })}
            placeholder="Enter role name"
            className="mt-1"
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>
          <Input
            id="description"
            {...register("description")}
            placeholder="Enter role description"
            className="mt-1"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Role"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
