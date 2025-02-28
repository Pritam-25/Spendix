"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { RecurringInterval } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { serializeTransaction } from "./serialize";
import { request } from "@arcjet/next";
import aj from "@/app/api/arcjet/route";
import { TransactionFormType } from "@/app/lib/schema";

export async function createTransaction(data: TransactionFormType) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        //* Debugging: Check if request object is received
        const req = await request();

        //  Check rate limit
        const decision = await aj.protect(req, {
            userId,
            requested: 1, // specify how many tokens to consume
        });



        if (decision.isDenied()) {

            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: {
                        remaining,
                        resetInSeconds: reset,
                    },
                });

                throw new Error("Too many requests. Please try again later.");
            }

            throw new Error("Request blocked by Arcjet.");
        }


        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const account = await prisma.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id,
            },
        });

        if (!account) {
            throw new Error("Account not found");
        }

        // Calculate balance change
        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
        const newBalance = Number(account.balance) + Number(balanceChange);

        // Function to calculate next recurring date
        function calculateNextRecurringDate(startDate: Date, interval: RecurringInterval) {
            const date = new Date(startDate);

            switch (interval) {
                case RecurringInterval.DAILY:
                    date.setDate(date.getDate() + 1);
                    break;
                case RecurringInterval.WEEKLY:
                    date.setDate(date.getDate() + 7);
                    break;
                case RecurringInterval.MONTHLY:
                    date.setMonth(date.getMonth() + 1);
                    break;
                case RecurringInterval.YEARLY:
                    date.setFullYear(date.getFullYear() + 1);
                    break;
                default:
                    break;
            }

            return date;
        }

        const transaction = await prisma.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval
                            ? calculateNextRecurringDate(data.date, data.recurringInterval)
                            : null,
                },
            });

            // Update account balance
            await tx.account.update({
                where: { id: data.accountId },
                data: { balance: newBalance },
            });

            return newTransaction;
        });

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);

        return { success: true, data: serializeTransaction(transaction) };
    } catch (error) {
        console.error("Error in createTransaction:", error);
        throw new Error((error as Error).message);
    }
}
