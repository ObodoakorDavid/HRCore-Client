import { useEmployeeStore } from "@/store/useEmployeeStore";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface UpdateFormInputs {
  name: string;
  email: string;
  position: string;
}

export default function EmployeeUpdate() {
  const { employee } = useEmployeeStore();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<UpdateFormInputs>({
    defaultValues: {
      name: employee.name,
      email: employee.email,
      position: employee.position,
    },
  });

  const onSubmit = (data: UpdateFormInputs) => {
    console.log(data);
    
    // updateEmployee(data); // Function to update the employee in the store or backend
    navigate("/dashboard/employee/profile");
  };

  return (
    <div className="max-w-3xl mx-auto">
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
          <label className="block font-semibold mb-2">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Position</label>
          <input
            type="text"
            {...register("position")}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
