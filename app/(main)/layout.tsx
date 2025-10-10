"use client";
import { usePathname } from "next/navigation";

import { Sidebar } from "../components/sidebar/Sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="flex flex-row">
      {!isLoginPage && <Sidebar />}
      <main className="ml-[208px]">{children}</main>
    </div>
  );
}
