import { AccountType, RecurringInterval } from "@prisma/client";
import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(3, "Name is required"),
  type: z.nativeEnum(AccountType), // Using Prisma's AccountType enum
  balance: z.string().min(1, "Initial balance is required"),
  isDefault: z.boolean().default(false),
});

export type AccountFormType = z.infer<typeof accountSchema>;


// ___________________________________________________ //
export const transactionSchema = z.object({
  date: z.date(),
  type: z.enum(["EXPENSE", "INCOME"] as const),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
  accountId: z.string().min(1, "Account is required"),
  category: z.string().min(1, "Category is required"),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.nativeEnum(RecurringInterval).optional(),
}).superRefine((data, ctx) => {
  if (data.isRecurring) {
    if (!data.recurringInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recurring interval is required",
        path: ["recurringInterval"]
      })
    }
  }
})

export type TransactionFormType = z.infer<typeof transactionSchema>;
