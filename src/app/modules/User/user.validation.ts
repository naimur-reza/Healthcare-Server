import { z } from "zod";

const createUserValidation = z.object({
  body: z.object({
    password: z.string(),
    admin: z.object({
      name: z.string(),
      email: z.string(),
    }),
  }),
});

export const userValidation = {
  createUserValidation,
};
