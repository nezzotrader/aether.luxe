import { formatPrice } from "./format";
import type { Order } from "@/types/product";

type EmailJsResult = {
  sent: boolean;
  message: string;
};

function hasEmailJsConfig() {
  return Boolean(
    process.env.EMAILJS_SERVICE_ID &&
      process.env.EMAILJS_TEMPLATE_ID &&
      process.env.EMAILJS_PUBLIC_KEY,
  );
}

function formatOrderItems(order: Order) {
  return order.items
    .map((item) => {
      const options = [
        item.color ? `Colour / Design: ${item.color}` : "",
        item.size ? `Size: ${item.size}` : "",
      ]
        .filter(Boolean)
        .join(" / ");
      return `${item.quantity} x ${item.name}${options ? ` (${options})` : ""} - ${formatPrice(item.price * item.quantity)}`;
    })
    .join("\n");
}

export async function sendInvoiceEmail(
  order: Order,
  invoiceUrl: string,
): Promise<EmailJsResult> {
  if (!hasEmailJsConfig()) {
    return {
      sent: false,
      message:
        "EmailJS is not configured. Add EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY.",
    };
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        to_email: order.customerEmail,
        to_name: order.customerName,
        customer_email: order.customerEmail,
        customer_name: order.customerName,
        invoice_url: invoiceUrl,
        invoice_number: order.invoiceNumber || order._id,
        order_total: formatPrice(order.total),
        order_subtotal: formatPrice(order.subtotal),
        shipping_fee: formatPrice(order.shippingFee),
        shipping_country: order.shippingCountry,
        discount: order.discount ? formatPrice(order.discount) : "",
        promo_code: order.promoCode || "",
        order_items: formatOrderItems(order),
        shipping_address: order.shippingAddress,
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    return {
      sent: false,
      message: message || "EmailJS could not send the invoice.",
    };
  }

  return { sent: true, message: "Invoice email sent to customer." };
}
