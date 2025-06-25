import "@/app/globals.css";
import "./globals.css";
import { AdminInfoProvider } from "@/contexts/AdminInfo";
import getAdminInfo from "@/utils/server/getAdminInfo";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin Info
  const adminInfo = await getAdminInfo();

  // Render
  return (
    <div className="admin-area">
      <AdminInfoProvider adminInfo={adminInfo}>
        {/* Sidebar */}
        <div className="sidebar"></div>

        {/* Page */}
        <div className="">{children}</div>
      </AdminInfoProvider>
    </div>
  );
}
