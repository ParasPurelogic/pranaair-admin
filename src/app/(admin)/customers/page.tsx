import getAllCustomers from "@/fetchers/getAllCustomers";
import PageCustomers from "@/components/Pages/Customers";
import { routes } from "@/config";
import getAdminInfo from "@/utils/server/getAdminInfo";

export const metadata = {
  title: routes.customers.name,
};

export default async function Page() {
  // admin info
  const adminInfo = await getAdminInfo();
  // Fetch data
  const data = await getAllCustomers({
    options: {
      token: adminInfo?.token || "",
    },
  });

  // Render
  return <PageCustomers data={data || []} />;
}
