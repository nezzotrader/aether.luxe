import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SuccessClient } from "./SuccessClient";

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <SuccessClient />
      </Suspense>
      <Footer />
    </>
  );
}
