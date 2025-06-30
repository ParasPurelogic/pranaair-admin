import PageProducts from "@/components/Pages/Products";
import { routes } from "@/config";
import getAllProducts from "@/fetchers/getAllProducts";
import getProductCategories from "@/fetchers/getProductCategories";
import getAdminInfo from "@/utils/server/getAdminInfo";

export const metadata = {
  title: routes.products.name,
};

export default async function Page() {
  // Admin Info
  const adminInfo = await getAdminInfo();
  // Fetch All Products and Categories
  const [products, categories] = await Promise.all([
    getAllProducts({
      options: {
        token: adminInfo?.token ?? "",
      },
    }),
    getProductCategories({
      options: {
        token: adminInfo?.token ?? "",
      },
    }),
  ]);

  // render
  return (
    <PageProducts
      products={products || []}
      productCategories={categories || []}
    />
  );
}
