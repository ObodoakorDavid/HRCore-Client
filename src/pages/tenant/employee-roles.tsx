import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import CustomPagination from "@/components/custom-pagination";
import { useRoleActions, useRoleStore } from "@/store/useRoleStore";
import AddRoleModal from "./modals/add-role-modal";
import { Input } from "@/components/ui/input";

export default function RolesTable() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { roles } = useRoleStore();
  const { addRole, getRoles } = useRoleActions();
  const { isSubmitting, pagination } = useRoleStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("search", debouncedSearch);
        return newParams;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearch, setSearchParams]);

  useEffect(() => {
    if (!page) {
      getRoles({ page: 1, limit: 10 });
    } else {
      getRoles({ page, limit: 10 });
    }
  }, [searchParams, getRoles]);

  // Fetch employees
  useEffect(() => {
    getRoles({ page, limit: 10, search });
  }, [page, search, getRoles]);

  const openRoleModal = () => setIsRoleModalOpen(true);
  const closeRoleModal = () => setIsRoleModalOpen(false);

  const handleAddRole = async (data: {
    name: string;
    description?: string;
  }) => {
    await addRole(data, () => {
      closeRoleModal();
      getRoles({ page: 1, limit: 10 });
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearch(e.target.value);
  };

  const handleDeleteRole = async (id: string) => {
    toast("Delete functionality not implemented yet!");
    // Uncomment below to enable delete functionality
    // await deleteRole(id, () => {
    //   getAllRoles({ page: 1, limit: 10 });
    // });
  };

  console.log(roles);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Roles</h1>
        <div className="flex">
          <Input
            type="text"
            placeholder="Search by name or email"
            value={debouncedSearch}
            onChange={handleSearchChange}
            className="mr-2 w-fit"
          />
          <Button onClick={openRoleModal}> Add Role</Button>
        </div>
      </div>

      <table className="min-w-full bg-white border rounded-md shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border">Name</th>
            <th className="text-left p-2 border">Description</th>
            <th className="text-left p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles?.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50">
              <td className="text-left p-2 border">{role.name}</td>
              <td className="text-left p-2 border">
                {role.description || "N/A"}
              </td>
              <td className="text-left p-2 border">
                <Button
                  variant="ghost"
                  className="text-red-600 hover:text-red-800"
                  // onClick={() => handleDeleteRole(role.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CustomPagination pagination={pagination} />

      <AddRoleModal
        isOpen={isRoleModalOpen}
        onClose={closeRoleModal}
        onSubmit={handleAddRole}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
