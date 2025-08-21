import { Sidebar } from "../components/sidebar/Sidebar";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-row">
      <Sidebar/>
      {children}
    </div>
  );
}
