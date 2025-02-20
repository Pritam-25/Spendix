import { AccountType } from "@prisma/client";
import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(3, "Name is required"),
  type: z.nativeEnum(AccountType), // Using Prisma's AccountType enum
  balance: z.string().min(1, "Initial balance is required"),
  isDefault: z.boolean().default(false),
});

export type AccountFormType = z.infer<typeof accountSchema>;
