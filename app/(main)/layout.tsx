"use client";
import { usePathname } from "next/navigation";

import { Sidebar } from "../components/sidebar/Sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <div className="flex flex-row justify-center min-h-screen">
        <main className="w-full">{children}</main>
      </div>
    );
  } else {
    return (
      // ❌ ลบ flex flex-row ออก
      // ✅ ใส่ min-h-screen และ bg-gray-50 เพื่อความสวยงาม
      <div className="min-h-screen">
        <Sidebar />

        {/* พอ Parent ไม่ใช่ Flex, ตัว main จะยืดเต็มจออัตโนมัติ (หักลบ ml-210px เอง) */}
        <main className="ml-[210px] p-4">{children}</main>
      </div>
    );
  }
}
