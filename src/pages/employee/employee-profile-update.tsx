import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/file-upload";

interface UpdateFormInputs {
  name: string;
  email: string;
  jobRole: string;
  file: FileList | null;
}

export default function EmployeeProfileUpdate() {
  const { employee, isSubmitting } = useEmployeeStore();
  const { updateEmployeeProfile } = useEmployeeActions();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormInputs>({
    defaultValues: {
      name: employee.name,
      email: employee.email,
      jobRole: employee.jobRole,
      file: null,
    },
  });

  const onSubmit = async (data: UpdateFormInputs) => {
    const file = data.file?.[0]; // Extract the first file from FileList
    if (file) {
      console.log("Selected file:", file);
    }

    const payload = {
      ...data,
      file,
    };

    await updateEmployeeProfile(payload, () => {
      console.log("Complete");
      navigate("/dashboard/employee/profile");
    });
  };

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-start">Update Profile</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label className="block font-semibold mb-2">Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Job Role</label>
          <input
            type="text"
            {...register("jobRole")}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="mb-4">
          <FileUpload
            label="Upload File"
            register={{ ...register("file") }}
            error={errors.file}
            accept=".jpg,.png,.pdf"
            maxSize={10 * 1024 * 1024}
          />
        </div>
        <div className="flex justify-end">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
