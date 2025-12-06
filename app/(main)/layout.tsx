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
      <div className="flex flex-row justify-center">
        <main>{children}</main>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row">
        <Sidebar />
        <main className="ml-[210px]">{children}</main>
      </div>
    );
  }
}
