import prisma from "@/lib/prisma";
import { inngest } from "./client";
import { RecurringInterval, Transaction } from "@prisma/client";
import { sendEmail } from "@/actions/send-eamil";
import  EmailTemplate  from "../../../emails/my-email";

export const checkBudgetAlert = inngest.createFunction(
    {
        id: "check-budget-alert",
        name: "Check Budget Alerts",
    },
    { cron: "0 0 * * *" },   // Run Every Day at Midnight (12:00 AM)
    async ({ step, event }) => {
        try {
            function isNewMonth(lastAlertDate: Date, currentDate: Date) {
                return (
                    lastAlertDate.getMonth() !== currentDate.getMonth() || lastAlertDate.getFullYear() !== currentDate.getFullYear()
                )
            }

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

            const results = [];

            for (const budget of budgets) {
                const defaultAccount = budget?.user?.accounts?.[0] || null;
                if (!defaultAccount) continue;

                const result = await step.run(`check-budget-${budget.id}`, async () => {
                    const startDate = new Date();
                    startDate.setDate(1); // Start of current month

                    // Calculate total expenses for the default account only
                    const expenses = await prisma.transaction.aggregate({
                        where: {
                            userId: budget.userId,
                            accountId: defaultAccount.id,
                            type: "EXPENSE",
                            date: {
                                gte: startDate,
                            },
                        },
                        _sum: {
                            amount: true,
                        },
                    });

                    const totalExpenses = expenses._sum.amount?.toNumber() || 0;
                    const budgetAmount = Number(budget.amount) || 1;
                    const percentageUsed = (totalExpenses / budgetAmount) * 100;

                    console.log(`Checking budget for user ${budget.user.name} (${percentageUsed.toFixed(1)}% used)`);

                    if (percentageUsed >= 80) {
                        console.log(`Sending budget alert email for user ${budget.user.name}`);

                        const emailTemplate = EmailTemplate({
                            userName: budget.user.name,
                            type: "budget-alert",
                            data: {
                                percentageUsed,
                                budgetAmount: Number(budgetAmount),
                                totalExpenses: Number(totalExpenses),
                                accountName: defaultAccount.name
                            }
                        });

                        if (!emailTemplate) {
                            console.error("Failed to generate email template");
                            return { success: false, error: "Failed to generate email template" };
                        }

                        try {
                            const emailResult = await sendEmail({
                                to: budget.user.email,
                                subject: `Budget Alert: ${percentageUsed.toFixed(1)}% of your ${defaultAccount.name} budget used`,
                                react: emailTemplate
                            });

                            if (emailResult.success) {
                                console.log(`Budget alert email sent successfully to ${budget.user.email}`);
                                await prisma.budget.update({
                                    where: { id: budget.id },
                                    data: { lastAlertSent: new Date() }
                                });
                                return { success: true, message: `Email sent to ${budget.user.email}` };
                            } else {
                                console.error(`Failed to send budget alert email to ${budget.user.email}:`, emailResult.error);
                                return { success: false, error: emailResult.error };
                            }
                        } catch (error) {
                            console.error(`Error sending email to ${budget.user.email}:`, error);
                            return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
                        }
                    }
                    return { success: true, message: "Budget within limits" };
                });

                results.push(result);
            }

            return { success: true, results };
        } catch (error) {
            console.error("Error in checkBudgetAlert:", error);
            return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
        }
    }
);


export const triggerRecurringTransactions = inngest.createFunction(
    {
        id: "trigger-recurring-transactions",
        name: "Trigger Recurring Transactions"
    },
    { cron: "0 0 * * *" },  // runs daily midnight
    async ({ step }) => {

        //*  1: Fetch all due recurring transaction 
        const recurringTransactions = await step.run(
            "fetch-recurring-transactions",
            async () => {
                return await prisma.transaction.findMany({
                    where: {
                        isRecurring: true,
                        status: "COMPLETED",
                        OR: [
                            { lastProcessed: null },  // either it Never processed
                            { nextRecurringDate: { lte: new Date() } }  // or it lesser than or equal to current date (due date passed)
                        ]
                    }
                })
            }
        )

        //*  2:  Create events for each transaction
        if (recurringTransactions.length > 0) {
            const events = recurringTransactions.map((transaction) => ({
                name: "transaction.recurring.process",
                data: { transactionId: transaction.id, userId: transaction.userId }
            }))

            //* Send events to be processed
            await inngest.send(events)
        }

        return { triggered: recurringTransactions.length }
    },
)


export const processRecurringTransaction = inngest.createFunction(
    {
        id: "process-recurring-transaction",
        throttle: {
            limit: 10, // only process 10 transactions
            period: "1m",  // per minute
            key: "event.data.userId"  // per user
        }
    },
    { event: "transaction.recurring.process" },
    async ({ event, step }) => {
        // validate event data
        if (!event?.data?.transactionId || !event?.data?.userId) {
            console.error("Invalid event data", event);
            return { error: "Missing required event data" }
        }

        await step.run("process-transaction", async () => {
            const transaction = await prisma.transaction.findUnique({
                where: {
                    id: event.data.transactionId,
                    userId: event.data.userId
                },
                include: {
                    account: true,
                }
            })

            if (!transaction || !isTransactionDue(transaction)) return;

            await prisma.$transaction(async (tx) => {
                //* create new transaction
                await tx.transaction.create({
                    data: {
                        type: transaction.type,
                        amount: transaction.amount,
                        description: `${transaction.description}(Recurring)`,
                        date: new Date(),
                        category: transaction.category,
                        userId: transaction.userId,
                        accountId: transaction.accountId,
                        isRecurring: false,
                    }
                })

                //* update account balance
                const balanceChange =
                    transaction.type === "EXPENSE" ?
                        -transaction.amount.toNumber()
                        : transaction.amount.toNumber()

                await tx.account.update({
                    where: { id: transaction.accountId },
                    data: { balance: { increment: balanceChange } }
                })

                if (transaction.recurringInterval !== null) {
                    //* Update last processed data and next recurring date
                    await tx.transaction.update({
                        where: { id: transaction.id },
                        data: {
                            lastProcessed: new Date(),
                            nextRecurringDate: calculateNextRecurringDate(
                                new Date(),
                                transaction.recurringInterval
                            )
                        }
                    })
                }
            })
        })
    }
)

//* Check for due transactions ==>
function isTransactionDue(transaction: Transaction) {
    // if no lastprocessed date, transaction is due,
    if (!transaction.lastProcessed) return true;

    const today = new Date();
    const nextDue = transaction.nextRecurringDate ? new Date(transaction.nextRecurringDate) : null;

    // compare with nextDue date
    return nextDue !== null && nextDue <= today;
}

//* Function to calculate next recurring date
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

export const generateMonthlyReports = inngest.createFunction(
    {
        id: "generate-monthly-reports",
        name: "Generate Monthly Reports"
    },
    { cron: "0 0 1 * *" },
    async ({ step }) => {
        const users = await prisma.user.findMany({
            include: { accounts: true }
        })

        for (const user of users) {
            await step.run(`generate-report-${user.id}`, async () => {
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);

                const stats = await getMonthlyStats(user.id, lastMonth);
                const monthName = lastMonth.toLocaleString("default", {
                    month: "long"
                })

                // const insights = await generateFinancialInsight(stats, monthName);
            })
        }
    }
)


//* get monthly income and expense stats 
const getMonthlyStats = async (userId: string, month: Date) => {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0)

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    })

    return transactions.reduce(
        (stats, t) => {
            const amount = t.amount.toNumber();
            if (t.type === "EXPENSE") {
                stats.totalExpenses += amount;
                stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + amount
            } else {
                stats.totalIncome += amount
            }
            return stats
        }, {
        totalExpenses: 0,
        totalIncome: 0,
        byCategory: {} as Record<string, number>,
        transactionCount: transactions.length
    }
    )

}


//* get finaltial insights stats of the particular month
// const generateFinancialInsight = async (stats, month) => {

// } 