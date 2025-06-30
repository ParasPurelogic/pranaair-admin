import "@/app/globals.css";
import { AdminInfoProvider } from "@/contexts/AdminInfo";
import getAdminInfo from "@/utils/server/getAdminInfo";
import Sidebar from "./_Sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin Info
  const adminInfo = await getAdminInfo();

  // Render
  return (
    <div className="admin-area grid md:grid-cols-[auto_1fr] [&_>_*]:min-w-0 w-full h-full">
      <AdminInfoProvider adminInfo={adminInfo}>
        {/* Sidebar */}
        <Sidebar />

        {/* Page */}
        <div className="p-[var(--padding)] [--padding:var(--spacing-body)] sm:[--padding:2rem] w-full h-full overflow-y-auto">
          <div className="min-h-fit">{children}</div>
        </div>
      </AdminInfoProvider>
    </div>
  );
}
