"use server";

import prisma from "@/lib/prisma";
import { subDays } from "date-fns";
import { Prisma } from "@prisma/client";

const ACCOUNT_ID = "5247c121-24b3-4f22-b8c3-86bc18d99da1";
const USER_ID = "54ace900-8989-4c08-a1b8-889f24dd1efa";

// Define transaction type
type TransactionType = "INCOME" | "EXPENSE";

// Categories with their typical amount ranges
const CATEGORIES: Record<TransactionType, { name: string; range: number[] }[]> = {
    INCOME: [
        { name: "salary", range: [5000, 8000] },
        { name: "freelance", range: [1000, 3000] },
        { name: "investments", range: [500, 2000] },
        { name: "other-income", range: [100, 1000] },
    ],
    EXPENSE: [
        { name: "housing", range: [1000, 2000] },
        { name: "transportation", range: [100, 500] },
        { name: "groceries", range: [200, 600] },
        { name: "utilities", range: [100, 300] },
        { name: "entertainment", range: [50, 200] },
        { name: "food", range: [50, 150] },
        { name: "shopping", range: [100, 500] },
        { name: "healthcare", range: [100, 1000] },
        { name: "education", range: [200, 1000] },
        { name: "travel", range: [500, 2000] },
    ],
};

function getRandomAmount(min: number, max: number): number {
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type: TransactionType) {
    const categories = CATEGORIES[type];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = getRandomAmount(category.range[0], category.range[1]);
    return { category: category.name, amount };
}

export async function seedTransactions() {
    try {
        const transactions: Prisma.TransactionCreateManyInput[] = [];
        let totalBalance = 0;

        for (let i = 90; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

            for (let j = 0; j < transactionsPerDay; j++) {
                const type = Math.random() < 0.4 ? "INCOME" as const : "EXPENSE" as const;
                const { category, amount } = getRandomCategory(type);

                const transaction: Prisma.TransactionCreateManyInput = {
                    id: crypto.randomUUID(),
                    type,
                    amount,
                    description: `${type === "INCOME" ? "Received" : "Paid for"} ${category}`,
                    date,
                    category,
                    status: "COMPLETED",
                    userId: USER_ID,
                    accountId: ACCOUNT_ID,
                    createdAt: date,
                    updatedAt: date,
                };

                totalBalance += type === "INCOME" ? amount : -amount;
                transactions.push(transaction);
            }
        }

        await prisma.$transaction(async (tx) => {
            await tx.transaction.deleteMany({
                where: { accountId: ACCOUNT_ID },
            });

            await tx.transaction.createMany({
                data: transactions,
            });

            await tx.account.update({
                where: { id: ACCOUNT_ID },
                data: { balance: totalBalance },
            });
        });

        return {
            success: true,
            message: `Created ${transactions.length} transactions`,
        };
    } catch (error) {
        console.error("Error seeding transactions:", error);
        return { success: false, error: (error as Error).message };
    }
}