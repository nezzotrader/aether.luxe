# Aether Luxe by Azfar

A clean, premium, minimal dark luxury catalog website built with Next.js, TypeScript, Tailwind CSS, MongoDB, Cloudinary, and NextAuth.

This is a catalog, not a traditional ecommerce store. Customers browse products and place orders through the Google Form linked on every product detail page.

## Features

- Sticky dark header with swan logo, brand title, search, Catalog button, and Admin button
- Search by product name, brand, or product code
- Brand and category filters
- Sorting by newest, price low to high, and price high to low
- Pagination with 12 products per page
- Product cards with image, name, brand, category, price, description, and details link
- Product details page with multiple images and close-up images
- Google Form ordering button
- NextAuth credentials login for the owner
- Admin dashboard for adding, editing, deleting, and uploading product images
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
ADMIN_PASSWORD_HASH=$2b$10$replace_with_a_bcrypt_hash

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Generate a secure NextAuth secret:

```bash
openssl rand -base64 32
```

Generate the admin password hash:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('your-password-here', 10).then(console.log)"
```

The admin email and password are never hardcoded in source code. Authentication reads `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` from the environment.

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
  createdAt: Date;
}
```

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

## Order Form

The product detail call to action opens:

```text
https://forms.gle/fT4yjSWAr6rvnaNh6
```
