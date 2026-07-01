import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { authOptions } from "@/lib/auth";
import { getBrands } from "@/lib/brands";
import { getCategories } from "@/lib/categories";
import { getOrders } from "@/lib/orders";
import { getProducts } from "@/lib/products";
import { getPromoCodes } from "@/lib/promos";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const [{ products }, brands, categories, orders, promos] = await Promise.all([
    getProducts({ sort: "newest", limit: 1000 }),
    getBrands(),
    getCategories(),
    getOrders(),
    getPromoCodes(),
  ]);

  return (
    <>
      <Header showSearch={false} />
      <AdminDashboard
        initialProducts={products}
        initialBrands={brands}
        initialCategories={categories}
        initialOrders={orders}
        initialPromos={promos}
      />
    </>
  );
}
