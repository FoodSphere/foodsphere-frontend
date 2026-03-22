"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import { toast } from "@/app/components/ui/toast/use-toast";
import { setCookie } from "@/libs/cookie";
import { loginStaffWithPortal } from "@/services/staff/staffApi";
import { EUserType, PAGE_CORE_PERMISSIONS } from "@/types/enum";

// Type สำหรับข้อมูลใน JWT Token
interface IJwtPayload {
  role: string[];
  restaurant_id: string;
  user_type: string;
  permissions: number[];
}

export default function WorkerPortalRender({
  worker_portal_id,
}: {
  worker_portal_id: string;
}) {
  const router = useRouter();

  const handleStaffPortal = async () => {
    try {
      const response = await loginStaffWithPortal(worker_portal_id);

      if (response && response.data && response.data.access_token) {
        const token = response.data.access_token;

        // 2. Set Token Cookie
        setCookie("access_token", token);

        // 3. Decode Token (เพื่อดู Role)
        const decoded: IJwtPayload = jwtDecode(token);

        // 4. Logic: ดึงร้านค้า (Get Restaurants)
        try {
          if (decoded) {
            // Auto-Select ร้านแรก
            const restaurantId = decoded.restaurant_id;

            // เก็บ ID ร้านค้าลง Cookie
            setCookie("restaurant_id", restaurantId);

            console.log("Auto-selected restaurant:", restaurantId);

            // 5. Redirect ไปหน้าแรกที่ได้รับอนุญาต
            if (decoded.user_type === EUserType.MASTER) {
              router.push("/");
            } else if (decoded.user_type === EUserType.WORKER) {
              const userPermissions = decoded.permissions || [];

              // Find first route where user has ANY of the core permissions
              const firstPermittedRoute = Object.entries(
                PAGE_CORE_PERMISSIONS
              ).find(([_, coreIds]) =>
                coreIds.some((id) => userPermissions.includes(id))
              );

              if (firstPermittedRoute) {
                router.push(firstPermittedRoute[0]);
              } else {
                router.push("/");
              }
            } else {
              router.push("/");
            }
          } else {
                  // กรณีไม่มีร้านค้าเลย (อาจจะแจ้งเตือน หรือ Redirect ไปหน้าสร้างร้าน)
                  console.warn("No restaurants found for this user.");
                  toast({
                    title: "No restaurants found for this user.",
                    variant: "error",
                  });
                }
              } catch (shopError) {
                console.error("Failed to fetch restaurants", shopError);
                toast({
                  title: "Failed to fetch restaurants",
                  variant: "error",
                });
              }
            } else {
              console.error("Failed to login staff with portal: No access token received.");
              toast({
                title: "Failed to login staff with portal",
                variant: "error",
              });
            }
    } catch (error) {
      console.log("Failed to login staff with portal: ", error);
      toast({
        title: "Failed to login staff with portal",
        variant: "error",
      });
    }
  };
  useEffect(() => {
    handleStaffPortal();
  }, [worker_portal_id]);

  return (
    <div>
      <h1>Worker Portal: {worker_portal_id}</h1>
    </div>
  );
}
