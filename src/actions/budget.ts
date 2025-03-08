"use server"


import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"


export async function getCurrentBudget(accountId: string) {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId }
        })

        if (!user) {
            throw new Error("User not found")
        }

        // find the user budget
        const budget = await prisma.budget.findFirst({
            where: { userId: user.id }
        })

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




        // calculate the expense for the account
        const expense = await prisma.transaction.aggregate(
            {
                where: {
                    userId: user.id,
                    type: "EXPENSE",
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                    accountId
                },
                _sum: {
                    amount: true
                }
            }
        )

        // console.log(`expense: ${JSON.stringify(expense)}`);
        
        
        
        return {
            budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
            currentExpense: expense._sum.amount?.toNumber() ?? 0
        }
        


    } catch (error) {
        console.error("Error fetching budget", (error as Error));
        throw error;
    }
}


//* function for updating the budget
export async function updateBudget(amount: number) {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId }
        })

        if (!user) {
            throw new Error("User not found")
        }

        // if budget is already created update the budget or else create it
        const budget = await prisma.budget.upsert({
            where: { userId: user.id },
            update: {
                amount
            },
            create: {
                userId: user.id,
                amount
            }
        })

        revalidatePath("/dashboard");
        return {
            success: true,
            data: { ...budget, amount: budget.amount.toNumber() }
        }

    } catch (error) {
        console.error("Error updating budget: ", (error as Error));
        return {
            success: false,
            error: (error as Error).message
        }
    }
}