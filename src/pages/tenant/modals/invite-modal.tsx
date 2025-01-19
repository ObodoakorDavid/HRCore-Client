import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/modal";

interface InviteFormData {
  email: string;
  expiresIn: number;
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<InviteFormData>;
  isSubmitting: boolean;
}

export default function InviteModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: InviteModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormData>();

  const handleModalClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      heading="Generate Invite Link"
      isOpen={isOpen}
      onClose={handleModalClose}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Generate Invite Link</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
              type="email"
              placeholder="Enter email"
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expires In (Days)
            </label>
            <Input
              {...register("expiresIn", {
                required: "Number of days is required",
                valueAsNumber: true,
                min: { value: 1, message: "Minimum value is 1" },
              })}
              type="number"
              placeholder="Enter number of days"
              className="mt-1"
            />
            {errors.expiresIn && (
              <p className="text-red-500 text-sm">{errors.expiresIn.message}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={Object.keys(errors).length > 0 || isSubmitting}
            >
              {isSubmitting ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
