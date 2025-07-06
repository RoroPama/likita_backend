import { z } from "zod";

export const createEventSchema = z.object({
  type: z.string().min(1, "Le type est requis"),
  title: z.string().min(1, "Le titre est requis"),
  details: z.object({
    date: z.string().min(1, "La date est requise"),
    platform: z.string().min(1, "La plateforme est requise"),
  }),
  description: z.string().min(1, "La description est requise"),
  liveUrl: z.string().url("Le lien doit être une URL valide"),
  imageUrl: z.string(),
});
