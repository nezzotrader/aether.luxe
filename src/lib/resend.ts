import { Resend } from "resend";
import { formatPrice } from "./format";
import type { Order } from "@/types/product";

type EmailResult = {
  sent: boolean;
  message: string;
};

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/aether.luxe__?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@aether.luxe_?is_from_webapp=1&sender_device=pc",
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@aether.luxe_",
  },
];

function resendConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL,
    replyTo: process.env.RESEND_REPLY_TO || process.env.ADMIN_EMAIL,
    logoUrl: process.env.RESEND_LOGO_URL,
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

function formatOrderDate(order: Order) {
  const date = new Date(order.createdAt);

  if (Number.isNaN(date.getTime())) {
    return order.createdAt;
  }

  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
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
          <td style="padding:18px 12px 18px 0;border-bottom:1px solid #242424;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;">
            <strong style="display:block;color:#FFFFFF;font-size:15px;font-weight:600;letter-spacing:0.2px;">${escapeHtml(item.name)}</strong>
            <span style="display:block;margin-top:4px;color:#A9A9A9;font-size:12px;line-height:18px;">${escapeHtml(item.brand)} / SKU ${escapeHtml(item.productCode)}</span>
            ${options ? `<span style="display:block;margin-top:4px;color:#D4AF37;font-size:12px;line-height:18px;">${escapeHtml(options)}</span>` : ""}
          </td>
          <td align="center" style="padding:18px 8px;border-bottom:1px solid #242424;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;">
            ${item.quantity}
          </td>
          <td align="right" style="padding:18px 8px;border-bottom:1px solid #242424;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;white-space:nowrap;">
            ${escapeHtml(formatPrice(item.price))}
          </td>
          <td align="right" style="padding:18px 0 18px 8px;border-bottom:1px solid #242424;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;font-weight:700;white-space:nowrap;">
            ${escapeHtml(formatPrice(item.price * item.quantity))}
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderSocialLinks() {
  return SOCIAL_LINKS.map(
    (link) =>
      `<a href="${escapeHtml(link.href)}" target="_blank" style="color:#D4AF37;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;">${escapeHtml(link.label)}</a>`,
  ).join(
    '<span style="display:inline-block;width:14px;color:#5A5A5A;"> </span>',
  );
}

function renderInvoiceHtml(order: Order, invoiceUrl: string) {
  const config = resendConfig();
  const invoiceNumber = order.invoiceNumber || order._id;
  const orderDate = formatOrderDate(order);
  const logo = config.logoUrl
    ? `
      <img src="${escapeHtml(config.logoUrl)}" width="74" alt="Aether Luxe swan logo" style="display:block;width:74px;max-width:74px;height:auto;margin:0 auto 18px;border:0;outline:none;text-decoration:none;">
    `
    : `
      <div style="margin:0 auto 18px;color:#D4AF37;font-family:Georgia,'Times New Roman',serif;font-size:18px;letter-spacing:6px;text-align:center;">AETHER</div>
    `;
  const discountRow = order.discount
    ? `
        <tr>
          <td style="padding:8px 0;color:#B7B7B7;font-family:Arial,Helvetica,sans-serif;font-size:14px;">Promo ${escapeHtml(order.promoCode || "")}</td>
          <td align="right" style="padding:8px 0;color:#D4AF37;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;">-${escapeHtml(formatPrice(order.discount))}</td>
        </tr>
      `
    : "";

  return `
    <!doctype html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>Aether Luxe Invoice</title>
      </head>
      <body style="margin:0;padding:0;background-color:#0B0B0B;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          Thank you for your order. Your Aether Luxe invoice is ready.
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#0B0B0B;margin:0;padding:0;">
          <tr>
            <td align="center" style="padding:28px 12px;background-color:#0B0B0B;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:680px;margin:0 auto;border-collapse:separate;">
                <tr>
                  <td style="padding:34px 24px 20px;background-color:#111111;border:1px solid #242424;border-radius:22px 22px 0 0;box-shadow:0 18px 48px rgba(0,0,0,0.45);text-align:center;">
                    ${logo}
                    <div style="color:#D4AF37;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Aether Luxe</div>
                    <h1 style="margin:16px 0 0;color:#FFFFFF;font-family:Georgia,'Times New Roman',serif;font-size:42px;line-height:48px;font-weight:400;letter-spacing:0;">
                      Thank You For Your Order
                    </h1>
                    <p style="margin:16px auto 0;max-width:500px;color:#CFCFCF;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;">
                      Dear ${escapeHtml(order.customerName)}, your order has been received and confirmed. Below is your private invoice summary.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0;background-color:#111111;border-left:1px solid #242424;border-right:1px solid #242424;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:24px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B0B0B;border:1px solid #242424;border-radius:16px;">
                            <tr>
                              <td style="padding:18px 18px 10px;color:#8F8F8F;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Order ID</td>
                              <td align="right" style="padding:18px 18px 10px;color:#8F8F8F;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Payment</td>
                            </tr>
                            <tr>
                              <td style="padding:0 18px 18px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">${escapeHtml(invoiceNumber)}</td>
                              <td align="right" style="padding:0 18px 18px;">
                                <span style="display:inline-block;background-color:#1D1708;border:1px solid #D4AF37;border-radius:999px;color:#D4AF37;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;padding:7px 12px;text-transform:uppercase;">Paid</span>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" style="padding:0 18px 18px;color:#B7B7B7;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;">
                                Order date: <span style="color:#FFFFFF;">${escapeHtml(orderDate)}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 24px 24px;background-color:#111111;border-left:1px solid #242424;border-right:1px solid #242424;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B0B0B;border:1px solid #242424;border-radius:16px;">
                      <tr>
                        <td style="padding:24px 22px 6px;">
                          <h2 style="margin:0;color:#FFFFFF;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:32px;font-weight:400;">Invoice Details</h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 22px 22px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                            <tr>
                              <th align="left" style="padding:14px 12px 12px 0;border-bottom:1px solid #D4AF37;color:#D4AF37;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.7px;text-transform:uppercase;font-weight:700;">Product</th>
                              <th align="center" style="padding:14px 8px 12px;border-bottom:1px solid #D4AF37;color:#D4AF37;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.7px;text-transform:uppercase;font-weight:700;">Qty</th>
                              <th align="right" style="padding:14px 8px 12px;border-bottom:1px solid #D4AF37;color:#D4AF37;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.7px;text-transform:uppercase;font-weight:700;">Unit</th>
                              <th align="right" style="padding:14px 0 12px 8px;border-bottom:1px solid #D4AF37;color:#D4AF37;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.7px;text-transform:uppercase;font-weight:700;">Total</th>
                            </tr>
                            ${renderItemRows(order)}
                          </table>

                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:18px;border-collapse:collapse;">
                            <tr>
                              <td style="padding:8px 0;color:#B7B7B7;font-family:Arial,Helvetica,sans-serif;font-size:14px;">Subtotal</td>
                              <td align="right" style="padding:8px 0;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;">${escapeHtml(formatPrice(order.subtotal))}</td>
                            </tr>
                            <tr>
                              <td style="padding:8px 0;color:#B7B7B7;font-family:Arial,Helvetica,sans-serif;font-size:14px;">Shipping Fee (${escapeHtml(order.shippingCountry)})</td>
                              <td align="right" style="padding:8px 0;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;">${escapeHtml(formatPrice(order.shippingFee))}</td>
                            </tr>
                            ${discountRow}
                          </table>

                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:18px;background-color:#D4AF37;border-radius:14px;">
                            <tr>
                              <td style="padding:18px 20px;color:#0B0B0B;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Grand Total</td>
                              <td align="right" style="padding:18px 20px;color:#0B0B0B;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:34px;font-weight:700;">${escapeHtml(formatPrice(order.total))}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 24px 24px;background-color:#111111;border-left:1px solid #242424;border-right:1px solid #242424;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="50%" valign="top" style="padding:0 8px 0 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B0B0B;border:1px solid #242424;border-radius:16px;">
                            <tr>
                              <td style="padding:22px;">
                                <h3 style="margin:0;color:#FFFFFF;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:28px;font-weight:400;">Shipping Address</h3>
                                <p style="margin:12px 0 0;color:#CFCFCF;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:23px;">${escapeHtml(order.shippingAddress)}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td width="50%" valign="top" style="padding:0 0 0 8px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B0B0B;border:1px solid #242424;border-radius:16px;">
                            <tr>
                              <td style="padding:22px;">
                                <h3 style="margin:0;color:#FFFFFF;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:28px;font-weight:400;">What's Next?</h3>
                                <p style="margin:12px 0 0;color:#CFCFCF;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:23px;">Our team will review, prepare, and process your order. You will be contacted if we need any additional confirmation before delivery.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 24px 28px;background-color:#111111;border-left:1px solid #242424;border-right:1px solid #242424;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B0B0B;border:1px solid #242424;border-radius:16px;">
                      <tr>
                        <td style="padding:24px 22px;text-align:center;">
                          <h3 style="margin:0;color:#FFFFFF;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:30px;font-weight:400;">Customer Support</h3>
                          <p style="margin:12px auto 0;max-width:440px;color:#CFCFCF;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:23px;">Need help with your order? Reply directly to this email and our team will assist you.</p>
                          <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:20px auto 0;">
                            <tr>
                              <td style="background-color:#D4AF37;border-radius:999px;">
                                <a href="${escapeHtml(invoiceUrl)}" style="display:inline-block;padding:13px 24px;color:#0B0B0B;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:1.5px;text-decoration:none;text-transform:uppercase;">View Invoice</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:26px 24px 34px;background-color:#0B0B0B;border:1px solid #242424;border-top:0;border-radius:0 0 22px 22px;text-align:center;">
                    <div style="margin-bottom:16px;">
                      ${renderSocialLinks()}
                    </div>
                    <div style="color:#FFFFFF;font-family:Georgia,'Times New Roman',serif;font-size:18px;letter-spacing:4px;text-transform:uppercase;">Aether Luxe</div>
                    <div style="margin-top:8px;color:#777777;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;">Luxury catalog invoice / ${(new Date()).getFullYear()}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function renderInvoiceText(order: Order, invoiceUrl: string) {
  return [
    `Aether Luxe invoice ${order.invoiceNumber || order._id}`,
    "",
    `Thank you for your order, ${order.customerName}.`,
    `Order date: ${formatOrderDate(order)}`,
    "Payment status: Paid",
    "",
    `Items:\n${formatOrderItems(order)}`,
    "",
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Shipping (${order.shippingCountry}): ${formatPrice(order.shippingFee)}`,
    order.discount ? `Promo ${order.promoCode}: -${formatPrice(order.discount)}` : "",
    `Grand total: ${formatPrice(order.total)}`,
    "",
    `Shipping address: ${order.shippingAddress}`,
    "",
    "What's next: Our team will prepare and process your order. We will contact you if additional confirmation is needed before delivery.",
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
