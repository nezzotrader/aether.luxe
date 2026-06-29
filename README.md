# Aether

A clean, premium, mobile-friendly dark luxury catalog website built with Next.js, TypeScript, Tailwind CSS, MongoDB, Cloudinary, NextAuth, and Stripe.

This is a catalog, not a traditional ecommerce store. Customers browse products and place orders through the Google Form linked on every product detail page.

## Features

- Sticky dark header with swan logo, brand title, search, Catalog button, and Admin button
- Search by product name, brand, or product code
- Brand and category filters
- Sorting by newest, price low to high, and price high to low
- Pagination with 12 products per page
- Mobile-first catalog inspired by a luxury club layout
- Product cards with multi-image slider, brand, price, and add-to-cart
- Product details page with multiple images and close-up images
- Working cart and checkout
- QR payment with customer receipt upload
- Stripe Checkout payment option
- NextAuth credentials login for the owner
- Admin dashboard for products, brands, and orders
- Admin can confirm or reject receipt/paid orders
- MongoDB product schema
- Cloudinary image uploads
- Responsive luxury dark interface

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- Cloudinary
- NextAuth Credentials Provider

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/aether-luxe
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-long-random-secret

ADMIN_EMAIL=owner@example.com
ADMIN_PASSWORD=local_plain_password
ADMIN_PASSWORD_HASH=$2b$10$replace_with_a_bcrypt_hash

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NEXT_PUBLIC_QR_PAYMENT_IMAGE_URL=https://res.cloudinary.com/your-cloud/image/upload/your-payment-qr.png
STRIPE_SECRET_KEY=sk_test_replace_me

EMAILJS_SERVICE_ID=service_xxxxx
EMAILJS_TEMPLATE_ID=template_xxxxx
EMAILJS_PUBLIC_KEY=public_key_xxxxx
EMAILJS_PRIVATE_KEY=optional_private_key_xxxxx
```

Generate a secure NextAuth secret:

```bash
openssl rand -base64 32
```

Generate the admin password hash:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('your-password-here', 10).then(console.log)"
```

The admin email and password are never hardcoded in source code. Authentication reads `ADMIN_EMAIL` plus either `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH` from the environment. Use `ADMIN_PASSWORD` only for local convenience; keep `ADMIN_PASSWORD_HASH` for production.

EmailJS invoices use these template variables: `to_email`, `to_name`, `invoice_url`, `invoice_number`, `order_total`, `order_subtotal`, `shipping_fee`, `shipping_country`, `discount`, `promo_code`, `order_items`, and `shipping_address`.

## Product Schema

```ts
{
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  productCode: string;
  images: string[];
  colors: string[];
  sizes: string[];
  isActive: boolean;
  createdAt: Date;
}
```

## Orders

QR orders store the uploaded receipt URL and start as `pending_receipt`. Stripe orders create a Stripe Checkout Session and update to `paid` after the success page confirms the session. Admin can then set orders to `confirmed` or `rejected`.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin dashboard:

```text
http://localhost:3000/admin
```

## Admin Workflow

1. Sign in with the email and password configured in `.env.local`.
2. Upload one or more product images.
3. Fill in product name, brand, category, price, product code, and description.
4. Add the product.
5. Use the edit and delete controls to manage the catalog without coding.

## Folder Structure

```text
src/
  app/
    admin/
      login/
      AdminDashboard.tsx
      AdminProvider.tsx
      layout.tsx
      page.tsx
    api/
      auth/[...nextauth]/route.ts
      products/route.ts
      products/[id]/route.ts
      upload/route.ts
    products/[id]/page.tsx
    globals.css
    layout.tsx
    not-found.tsx
    page.tsx
  components/
    CatalogFilters.tsx
    Header.tsx
    Pagination.tsx
    ProductCard.tsx
    SwanLogo.tsx
  lib/
    auth.ts
    cloudinary.ts
    constants.ts
    db.ts
    format.ts
    products.ts
    validators.ts
  models/
    Product.ts
  types/
    product.ts
public/
  swan.svg
```

## Uploads

Product image uploads and receipt uploads use Cloudinary. If upload keeps loading, check that `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are real values and not placeholders.
