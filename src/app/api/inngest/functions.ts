import prisma from "@/lib/prisma";
import { inngest } from "../../../inngest/client";

export const checkBudgetAlert = inngest.createFunction(
    {
        id: "",
        name: "Check Budget Alerts",
    },
    { cron: "0 0 * * *" },   // Run Every Day at Midnight (12:00 AM)

    async ({ step }) => {

        function isNewMonth(lastAlertDate: Date, currentDate: Date) {
            return (
                lastAlertDate.getMonth() !== currentDate.getMonth() || lastAlertDate.getFullYear() !== currentDate.getFullYear()
            )
        }

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
                    // current date
                    const currentDate = new Date();
                    // strarting of a month from day 1
                    const startOfMonth = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        1
                    )
                    // ending of a month
                    const endOfMonth = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1,
                        0
                    )

                    const expenses = await prisma.transaction.aggregate({
                        where: {
                            userId: budget.userId,
                            accountId: defaultAccount.id,
                            type: "EXPENSE",
                            date: {
                                gte: startOfMonth,
                                lte: endOfMonth,
                            }
                        },
                        _sum: { amount: true }
                    });

                    const totalExpenses = expenses._sum.amount?.toNumber() || 0;
                    const budgetAmount = Number(budget.amount) || 1; // Prevent division by zero
                    const percentageUsed = (totalExpenses / budgetAmount) * 100;




                    if (percentageUsed >= 80 && (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), new Date()))) {
                        // send email

                        // update lastAlertSent
                        await prisma.budget.update({
                            where: { id: budget.id },
                            data: { lastAlertSent: new Date() }
                        })
                    }
                });
            }
        } catch (error) {
            console.error("Error running budget alerts:", error);
        }

    },
);
