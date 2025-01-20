import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState({ state: false, message: "" });
  const { tenantId } = useParams<{ tenantId: string }>();

  const { isSubmitting } = useEmployeeStore();
  const { acceptInvite } = useEmployeeActions();

  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError({
        state: true,
        message: "Link is broken or missing required parameters.",
      });
      return;
    }

    const onSuccess = () => {
      toast.success("Invite Accepted!");
      navigate(`/login`, { replace: true });
    };

    const onError = (message: string) => {
      setError({
        state: true,
        message,
      });
    };

    acceptInvite({ tenantId, token }, onSuccess, onError);
  }, [searchParams, tenantId, acceptInvite, navigate]);

  if (isSubmitting) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <p className="py-4 font-semibold">One moment, accepting invite...</p>
      </div>
    );
  }

  if (error.state) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <p className="py-4 font-semibold">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <p className="py-4 font-semibold">One moment, processing...</p>
    </div>
  );
}
