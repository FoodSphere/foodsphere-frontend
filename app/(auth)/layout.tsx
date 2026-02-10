"use client";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-row justify-center min-h-screen">
      <main className="w-full">{children}</main>
    </div>
  );
}
