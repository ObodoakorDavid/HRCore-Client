import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/file-upload";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import axiosInstance from "@/lib/axios.config";

interface UpdateFormInputs {
  name: string;
  email: string;
  lineManager: string;
  file: FileList | null;
}

interface EmployeeInfo {
  _id: string;
  name: string;
  email: string;
}

export default function EmployeeProfileUpdate() {
  const { employee, isSubmitting } = useEmployeeStore();
  const { updateEmployeeProfile } = useEmployeeActions();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<UpdateFormInputs>({
    defaultValues: {
      name: employee.name,
      email: employee.email,
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

  const handleFetchOptions = async (search: string) => {
    try {
      const response = await axiosInstance.get(
        `/employee?search=${encodeURIComponent(search)}&limit=5`
      );

      console.log({ data: response?.data?.data });

      const employees = response?.data?.data?.employees;

      return employees
        .filter((newEmployee: EmployeeInfo) => employee._id !== newEmployee._id)
        ?.map((item: EmployeeInfo) => ({
          value: item._id,
          label: item.name || item.email,
        }));
    } catch {
      return [];
    }
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
          <label className="block text-sm font-medium mb-1">Line Manager</label>
          <SearchableDropdown
            searchInputPlaceholder="Search for a line manager"
            placeholder={
              employee?.lineManager?.name ||
              employee?.lineManager?.email ||
              "Search for a line manager"
            }
            fetchOptions={handleFetchOptions}
            onChange={(value) => {
              console.log("Selected Level ID:", value);
              setValue("lineManager", value);
              clearErrors(["lineManager"]);
            }}
          />
          <input
            type="text"
            {...register("lineManager", {
              required: "Level is required",
            })}
            className="hidden"
          />

          {errors.lineManager && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lineManager?.message}
            </p>
          )}
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
