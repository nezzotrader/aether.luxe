import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { authOptions } from "@/lib/auth";
import { getProducts } from "@/lib/products";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const { products } = await getProducts({ sort: "newest", limit: 1000 });

  return (
    <>
      <Header />
      <AdminDashboard initialProducts={products} />
    </>
  );
}
