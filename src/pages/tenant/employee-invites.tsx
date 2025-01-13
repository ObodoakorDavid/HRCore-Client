import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTenantActions, useTenantStore } from "@/store/useTenantStore";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Clipboard } from "lucide-react";
import CustomPagination from "@/components/custom-pagination";
import InviteModal from "./modals/invite-modal";
import BulkInviteModal from "./modals/bulk-invite-modal";

export default function EmployeeInvites() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isBulkInviteModalOpen, setIsBulkInviteModalOpen] = useState(false);
  const { invites } = useTenantStore();
  const { sendInviteLink, getAllLinks, bulkInvite } = useTenantActions();
  const { isSubmitting, pagination } = useTenantStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const page = searchParams.get("page");
    if (!page) {
      getAllLinks({ page: 1, limit: 10 });
    } else {
      getAllLinks({ page: page.toString(), limit: 10 });
    }
  }, [searchParams, getAllLinks]);

  const openInviteModal = () => setIsInviteModalOpen(true);
  const closeInviteModal = () => setIsInviteModalOpen(false);

  const openBulkInviteModal = () => setIsBulkInviteModalOpen(true);
  const closeBulkInviteModal = () => setIsBulkInviteModalOpen(false);

  const handleGenerateInvite = async (data: {
    email: string;
    expiresIn: number;
  }) => {
    await sendInviteLink({ ...data }, () => {
      closeInviteModal();
      getAllLinks({ page: 1, limit: 10 });
    });
  };

  const handleBulkInvite = async (file: File) => {
    console.log("Uploading file:", file);

    await bulkInvite({ file }, () => {
      closeBulkInviteModal();
      getAllLinks({ page: 1, limit: 10 });
    });
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-lg font-semibold">Employee Invites</h1>
        <div className="flex gap-2">
          <Button onClick={openInviteModal}>Generate Invite Link</Button>
          <Button onClick={openBulkInviteModal} variant="outline">
            Bulk Invite
          </Button>
        </div>
      </div>

      <table className="min-w-full bg-white border rounded-md shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border">Email</th>
            <th className="text-left p-2 border">Expires At</th>
            <th className="text-left p-2 border">Status</th>
            <th className="text-left p-2 border">URL</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="text-left p-2 border">{invite.email}</td>
              <td className="text-left p-2 border">
                {new Date(invite.expiresAt).toLocaleDateString()}
              </td>
              <td className="text-left p-2 border">{invite.status}</td>
              <td className="text-left p-2 border flex items-center gap-2">
                <span className="truncate">{invite.url?.slice(0, 20)}</span>
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => copyToClipboard(invite.url)}
                  aria-label="Copy URL"
                >
                  <Clipboard size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CustomPagination pagination={pagination} />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        onSubmit={handleGenerateInvite}
        isSubmitting={isSubmitting}
      />

      <BulkInviteModal
        isOpen={isBulkInviteModalOpen}
        onClose={closeBulkInviteModal}
        onSubmit={handleBulkInvite}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
