import { z } from "zod";

export const createCommentSchema = z.object({
  text: z
    .string()
    .min(1, "Le texte du commentaire est requis.")
    .max(500, "Le commentaire ne peut pas dépasser 500 caractères.")
    .trim(),
});
