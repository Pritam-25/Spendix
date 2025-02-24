import prisma from "@/lib/prisma";
import { inngest } from "../../../inngest/client";

export const helloWorld = inngest.createFunction(
    {
        id: "",
        name: "Check Budget Alerts",
    },
    { cron: "0 0 * * *" },   // Run Every Day at Midnight (12:00 AM)
    async ({ event, step }) => {
        // await step.sleep("wait-a-moment", "1s");
        // return { message: `Hello ${event.data.email}!` };

        try {
            const budgets = await step.run("fetch-budget", async () => {
                return await prisma.budget.findMany({
                    include: {
                        user: {
                            include: {
                                accounts: {
                                    where: { isDefault: true }
                                }
                            }
                        }
                    }
                });
            });

            for (const budget of budgets) {
                const defaultAccount = budget?.user?.accounts?.[0] || null;
                if (!defaultAccount) continue;

                await step.run(`check-budget-${budget.id}`, async () => {
                    const startDate = new Date();
                    startDate.setDate(1); // Start from the first day of the month

                    const expenses = await prisma.transaction.aggregate({
                        where: {
                            userId: budget.userId,
                            accountId: defaultAccount.id,
                            type: "EXPENSE",
                            date: { gte: startDate }
                        },
                        _sum: { amount: true }
                    });

                    const totalExpenses = expenses._sum.amount?.toNumber() || 0;
                    const budgetAmount = Number(budget.amount) || 1; // Prevent division by zero
                    const percentageUsed = (totalExpenses / budgetAmount) * 100;

                    console.log(`Budget ${budget.id} used ${percentageUsed.toFixed(2)}%`);
                });
            }
        } catch (error) {
            console.error("Error running budget alerts:", error);
        }

    },
);
