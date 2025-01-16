import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddTenantModal from "./modal/add-tenant-modal";
import { useAdminActions, useAdminStore } from "@/store/useAdminStore";

// Define the Tenant type interface
interface Tenant {
  id: string;
  name: string;
  email: string;
  color: string;
  logo: string;
}

export default function Tenants() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tenants, isSubmitting } = useAdminStore();
  const { getTenants, addTenant } = useAdminActions();

  useEffect(() => {
    getTenants({ page: 1, limit: 10 });
  }, [getTenants]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddTenant = async (data: Omit<Tenant, "id">) => {
    await addTenant(data, () => {
      closeModal();
      toast.success("Tenant added successfully!");
      getTenants({ page: 1, limit: 10 });
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Tenants</h1>
        <Button onClick={openModal}>Add New Tenant</Button>
      </div>

      <table className="min-w-full bg-white border rounded-md shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border">Name</th>
            <th className="text-left p-2 border">Email</th>
            <th className="text-left p-2 border">Color</th>
            <th className="text-left p-2 border">Logo</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant: Tenant) => (
            <tr key={tenant.id} className="hover:bg-gray-50">
              <td className="text-left p-2 border">{tenant.name}</td>
              <td className="text-left p-2 border">{tenant.email}</td>
              <td
                className="text-left p-2 border"
                style={{ backgroundColor: tenant.color }}
              >
                {tenant.color}
              </td>
              <td className="text-left p-2 border">
                <img
                  src={tenant.logo}
                  alt={tenant.name}
                  className="w-8 h-8 rounded-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddTenantModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddTenant}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
