"use client";

import { useRouter } from "next/navigation";
import { getCookie } from "@/libs/cookie";
import { EPermission, EUserType, PAGE_CORE_PERMISSIONS } from "@/types/enum";

interface DecodedToken {
  user_type: string;
  permissions: number[] | null;
}

export default function ForbiddenPage() {
  const router = useRouter();

  const handleGoToOtherPage = () => {
    const token = getCookie("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      ) as DecodedToken;

      if (decodedPayload.user_type === EUserType.MASTER) {
        router.push("/");
        return;
      }

      if (decodedPayload.user_type === EUserType.WORKER) {
        const userPermissions = decodedPayload.permissions || [];
        
        // Find first route where user has ANY of the core permissions
        const firstPermittedRoute = Object.entries(PAGE_CORE_PERMISSIONS).find(
          ([_, coreIds]) => coreIds.some((id) => userPermissions.includes(id))
        );

        if (firstPermittedRoute) {
          router.push(firstPermittedRoute[0]);
        } else {
          router.back();
        }
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-fail-01"
        >
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m14.5 9.5-5 5" />
          <path d="m9.5 9.5 5 5" />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <h5 className="text-foreground">403 — Access Denied</h5>
        <p className="body1 text-textcolor-gray-01 max-w-md">
          You don&apos;t have permission to access this page. Please contact
          your manager if you believe this is a mistake.
        </p>
      </div>

      <button
        onClick={() => handleGoToOtherPage()}
        className="px-6 py-3 rounded-lg bg-primary-orange-main text-white font-semibold 
                   hover:opacity-90 transition-opacity cursor-pointer"
      >
        Go Other Page
      </button>
    </div>
  );
}
