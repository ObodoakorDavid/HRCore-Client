// import { useEmployeeActions, useEmployeeStore } from "@/store/useEmployeeStore";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "sonner";

// export default function AcceptInvite() {
//   const [searchParams] = useSearchParams();
//   const [error, setError] = useState({ state: false, message: "" });
//   const { tenantId } = useParams<{ tenantId: string }>();

//   const { isSubmitting } = useEmployeeStore();
//   const { acceptInvite } = useEmployeeActions();

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = searchParams.get("token");

//     if (!token) {
//       setError({
//         state: true,
//         message: "Link is broken or missing required parameters.",
//       });
//       return;
//     }

//     const onSuccess = () => {
//       toast.success("Invite Accepted!");
//       navigate(`/login`, { replace: true });
//     };

//     const onError = (message: string) => {
//       setError({
//         state: true,
//         message,
//       });
//     };

//     acceptInvite({ tenantId, token }, onSuccess, onError);
//   }, [searchParams, tenantId, acceptInvite, navigate]);

//   if (isSubmitting) {
//     return (
//       <div className="bg-gray-100 min-h-screen">
//         <p className="py-4 font-semibold">One moment, accepting invite...</p>
//       </div>
//     );
//   }

//   if (error.state) {
//     return (
//       <div className="bg-gray-100 min-h-screen">
//         <p className="py-4 font-semibold">{error.message}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <p className="py-4 font-semibold">One moment, processing...</p>
//     </div>
//   );
// }

import { acceptInvite } from "@/api/employee.api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const {
    isPending, // Loading state
    isError, // Error state
    error, // Error object
    data, // Success data
  } = useQuery({
    queryKey: ["acceptInvite", tenantId, token], // Unique key for the query
    queryFn: () => {
      if (!token) {
        throw new Error("Link is broken or missing required parameters.");
      }
      return acceptInvite({ tenantId, token }); // Call the API function
    },
    retry: false, // Disable retries for this query
  });

  // Handle success side effect
  useEffect(() => {
    if (data) {
      toast.success("Invite Accepted!");
      navigate(`/login`, { replace: true });
    }
  }, [data, navigate]);

  // Handle error side effect
  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  if (isPending) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <p className="py-4 font-semibold">One moment, accepting invite...</p>
      </div>
    );
  }

  if (isError) {
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
