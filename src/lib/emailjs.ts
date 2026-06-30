import { formatPrice } from "./format";
import type { Order } from "@/types/product";

type EmailJsResult = {
  sent: boolean;
  message: string;
};

function emailJsConfig() {
  return {
    serviceId: process.env.EMAILJS_SERVICE_ID,
    templateId: process.env.EMAILJS_TEMPLATE_ID,
    publicKey:
      process.env.EMAILJS_PUBLIC_KEY ||
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
      process.env.EMAILJS_USER_ID,
    privateKey:
      process.env.EMAILJS_PRIVATE_KEY ||
      process.env.EMAILJS_ACCESS_TOKEN ||
      process.env.EMAILJS_PRIVATE_TOKEN,
  };
}

function hasEmailJsConfig() {
  const config = emailJsConfig();

  return Boolean(
    config.serviceId &&
      config.templateId &&
      config.publicKey,
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
  const config = emailJsConfig();

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
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      accessToken: config.privateKey || undefined,
      template_params: {
        email: order.customerEmail,
        name: order.customerName,
        address: order.shippingAddress,
        reply_to: process.env.ADMIN_EMAIL || order.customerEmail,
        from_name: "Aether Luxe",
        admin_email: process.env.ADMIN_EMAIL || "",
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
        shipping_addess: order.shippingAddress,
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    return {
      sent: false,
      message:
        message === "Account not found"
          ? "EmailJS account not found. Check EMAILJS_PUBLIC_KEY matches your EmailJS Public Key, not the service ID."
          : message || "EmailJS could not send the invoice.",
    };
  }

  return {
    sent: true,
    message: `EmailJS accepted invoice email for ${order.customerEmail}. Check EmailJS history, inbox spam, and Gmail sent mail if it does not arrive.`,
  };
}
