import { Button } from "@/components/ui/button";
import { useTenantStore } from "@/store/useTenantStore";
// import { Link } from "react-router-dom";

export default function TenantProfile() {
  const { tenant } = useTenantStore();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-start">Tenant Profile</h1>
      <div className="flex justify-end gap-4 my-4">
        <Button disabled>Update Profile</Button>
      </div>

      <div className="mb-4 flex flex-col gap-2 text-start">
        <h2 className="text-xl font-semibold">Client Information</h2>
        <p className="text-gray-600">
          <span className="font-semibold">Name: </span>
          {tenant?.name ?? "N/A"}
        </p>
      </div>
    </div>
  );
}
