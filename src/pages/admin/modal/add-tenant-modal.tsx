import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";
import { Input } from "@/components/ui/input";

interface AddTenantFormValues {
  name: string;
  email: string;
  logo: string;
  color: string;
}

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const AddTenantModal: FC<AddTenantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddTenantFormValues>();

  const handleFormSubmit: SubmitHandler<AddTenantFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Modal heading="Add Tenant" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4">
        <h2 className="text-lg font-semibold mb-4">Add New Tenant</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <Input
            type="text"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <Input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Logo</label>
          <Input
            type="text"
            {...register("logo", { required: "Image URL is required" })}
          />
          {errors.logo && (
            <p className="text-red-500 text-sm">{errors.logo.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Color</label>
          <Input
            type="color"
            {...register("color", { required: "Color is required" })}
          />
          {errors.color && (
            <p className="text-red-500 text-sm">{errors.color.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Add Tenant"}
        </Button>
      </form>
    </Modal>
  );
};

export default AddTenantModal;
