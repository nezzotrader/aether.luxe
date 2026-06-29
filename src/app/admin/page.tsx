import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { authOptions } from "@/lib/auth";
import { getBrands } from "@/lib/brands";
import { getOrders } from "@/lib/orders";
import { getProducts } from "@/lib/products";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const [{ products }, brands, orders] = await Promise.all([
    getProducts({ sort: "newest", limit: 1000 }),
    getBrands(),
    getOrders(),
  ]);

  return (
    <>
      <Header />
      <AdminDashboard
        initialProducts={products}
        initialBrands={brands}
        initialOrders={orders}
      />
    </>
  );
}
