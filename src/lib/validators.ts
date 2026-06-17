import { z } from "zod";
import { BRANDS, CATEGORIES } from "./constants";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required."),
  brand: z.enum(BRANDS),
  category: z.enum(CATEGORIES),
  price: z.coerce.number().nonnegative("Price must be 0 or higher."),
  description: z.string().trim().min(10, "Description is required."),
  productCode: z.string().trim().min(2, "Product code is required."),
  images: z.array(z.string().url()).min(1, "Upload at least one image."),
});
