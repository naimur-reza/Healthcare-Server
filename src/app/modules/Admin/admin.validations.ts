import { z } from "zod";

const updateAdmin = z.object({
  body: z.object({
    name: z.string().optional(),
    isDeleted: z.boolean().optional(),
    profilePhoto: z.string().optional(),
  }),
});

export const adminValidation = {
  updateAdmin,
};
