import PageDashboard from "@/components/Pages/Dashboard";
import { routes } from "@/config";

export const metadata = {
  title: routes.dashboard.name,
};

export default function Page() {
  return <PageDashboard />;
}
