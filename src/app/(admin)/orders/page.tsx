import PageOrders from "@/components/Pages/Orders";
import { routes } from "@/config";

export const metadata = {
  title: routes.orders.name,
};

export default function Page() {
  return <PageOrders />;
}
