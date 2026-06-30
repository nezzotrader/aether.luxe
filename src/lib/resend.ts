import { Resend } from "resend";
import { formatPrice } from "./format";
import type { Order } from "@/types/product";

type EmailResult = {
  sent: boolean;
  message: string;
};

function resendConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL,
    replyTo: process.env.RESEND_REPLY_TO || process.env.ADMIN_EMAIL,
  };
}

function hasResendConfig() {
  const config = resendConfig();
  return Boolean(config.apiKey && config.fromEmail);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function renderItemRows(order: Order) {
  return order.items
    .map((item) => {
      const options = [
        item.color ? `Colour / Design: ${item.color}` : "",
        item.size ? `Size: ${item.size}` : "",
      ]
        .filter(Boolean)
        .join(" / ");

      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #2f141b;">
            <strong style="color:#ffffff;">${escapeHtml(`${item.quantity} x ${item.name}`)}</strong>
            ${options ? `<div style="margin-top:4px;color:#b9a3aa;font-size:13px;">${escapeHtml(options)}</div>` : ""}
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #2f141b;text-align:right;color:#ffffff;">
            ${escapeHtml(formatPrice(item.price * item.quantity))}
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderInvoiceHtml(order: Order, invoiceUrl: string) {
  const invoiceNumber = order.invoiceNumber || order._id;
  const discountRow = order.discount
    ? `
        <tr>
          <td style="padding:8px 0;color:#b9a3aa;">Promo ${escapeHtml(order.promoCode || "")}</td>
          <td style="padding:8px 0;text-align:right;color:#b8f5c5;">-${escapeHtml(formatPrice(order.discount))}</td>
        </tr>
      `
    : "";

  return `
    <!doctype html>
    <html>
      <body style="margin:0;background:#070102;padding:24px;font-family:Georgia,'Times New Roman',serif;color:#ffffff;">
        <div style="max-width:640px;margin:0 auto;background:#120407;border:1px solid #2f141b;border-radius:10px;overflow:hidden;">
          <div style="padding:28px 28px 18px;border-bottom:1px solid #2f141b;">
            <div style="font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#b9a3aa;">Aether Luxe</div>
            <h1 style="margin:12px 0 0;font-size:32px;line-height:1.1;color:#ffffff;">Order confirmed</h1>
            <p style="margin:12px 0 0;color:#cdbdc2;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;">
              Dear ${escapeHtml(order.customerName)}, your order has been confirmed. Your invoice details are below.
            </p>
          </div>

          <div style="padding:24px 28px;font-family:Arial,sans-serif;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#b9a3aa;">Invoice Number</td>
                <td style="padding:8px 0;text-align:right;color:#ffffff;font-weight:700;">${escapeHtml(invoiceNumber)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#b9a3aa;">Customer</td>
                <td style="padding:8px 0;text-align:right;color:#ffffff;">${escapeHtml(order.customerName)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#b9a3aa;">Shipping Address</td>
                <td style="padding:8px 0;text-align:right;color:#ffffff;">${escapeHtml(order.shippingAddress)}</td>
              </tr>
            </table>

            <table style="width:100%;border-collapse:collapse;margin-top:18px;">
              ${renderItemRows(order)}
            </table>

            <table style="width:100%;border-collapse:collapse;margin-top:18px;">
              <tr>
                <td style="padding:8px 0;color:#b9a3aa;">Subtotal</td>
                <td style="padding:8px 0;text-align:right;color:#ffffff;">${escapeHtml(formatPrice(order.subtotal))}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#b9a3aa;">Shipping (${escapeHtml(order.shippingCountry)})</td>
                <td style="padding:8px 0;text-align:right;color:#ffffff;">${escapeHtml(formatPrice(order.shippingFee))}</td>
              </tr>
              ${discountRow}
              <tr>
                <td style="padding:14px 0 0;border-top:1px solid #2f141b;color:#ffffff;font-weight:700;">Total</td>
                <td style="padding:14px 0 0;border-top:1px solid #2f141b;text-align:right;color:#ffffff;font-size:24px;font-weight:700;">${escapeHtml(formatPrice(order.total))}</td>
              </tr>
            </table>

            <a href="${escapeHtml(invoiceUrl)}" style="display:inline-block;margin-top:24px;background:#7f1730;color:#ffffff;text-decoration:none;padding:13px 18px;border-radius:6px;font-weight:700;">
              View invoice
            </a>
          </div>
        </div>
      </body>
    </html>
  `;
}

function renderInvoiceText(order: Order, invoiceUrl: string) {
  return [
    `Aether Luxe invoice ${order.invoiceNumber || order._id}`,
    "",
    `Dear ${order.customerName}, your order has been confirmed.`,
    "",
    `Items:\n${formatOrderItems(order)}`,
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Shipping (${order.shippingCountry}): ${formatPrice(order.shippingFee)}`,
    order.discount ? `Promo ${order.promoCode}: -${formatPrice(order.discount)}` : "",
    `Total: ${formatPrice(order.total)}`,
    "",
    `Shipping address: ${order.shippingAddress}`,
    `Invoice: ${invoiceUrl}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendInvoiceEmail(
  order: Order,
  invoiceUrl: string,
): Promise<EmailResult> {
  const config = resendConfig();

  if (!hasResendConfig()) {
    return {
      sent: false,
      message:
        "Resend is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL.",
    };
  }

  const resend = new Resend(config.apiKey);
  const { data, error } = await resend.emails.send({
    from: config.fromEmail as string,
    to: [order.customerEmail],
    replyTo: config.replyTo,
    subject: `Your Order Has Been Confirmed | Aether Luxe`,
    html: renderInvoiceHtml(order, invoiceUrl),
    text: renderInvoiceText(order, invoiceUrl),
  });

  if (error) {
    return {
      sent: false,
      message: error.message || "Resend could not send the invoice email.",
    };
  }

  return {
    sent: true,
    message: `Resend accepted invoice email for ${order.customerEmail}. Email ID: ${data?.id || "unknown"}.`,
  };
}
