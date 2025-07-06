// schemas/user.schema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});
