"use server"

import { AccountFormType } from "@/app/lib/schema"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Prisma, Transaction } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { serializeTransaction } from "./serialize"
import { promise } from "zod"

// create account
export async function createAccount(data: AccountFormType) {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId }
        })

        if (!user) {
            throw new Error("User not found")
        }

        // Convert balance to Prisma.Decimal
        // This ensures proper decimal handling without precision loss
        const balance = new Prisma.Decimal(data.balance.toString())

        // Validate the balance
        if (balance.isNaN()) {
            throw new Error("Invalid balance amount")
        }

        // Check if this is the user's first account
        const existingAccounts = await prisma.account.findMany({
            where: { userId: user.id }
        })

        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault

        // Only one account should be default at a time
        if (shouldBeDefault) {
            await prisma.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false }
            })
        }

        // Create new account with proper decimal handling
        const account = await prisma.account.create({
            data: {
                ...data,
                balance,  // Prisma will handle the Decimal type properly
                userId: user.id,
                isDefault: shouldBeDefault
            }
        })

        revalidatePath("/dashboard")
        return { success: true, data: serializeTransaction(account) }
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

// get all account
export async function GetUserAccount() {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId }
        })

        if (!user) {
            throw new Error("User not found")
        }

        const accounts = await prisma.account.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: {
                        transactions: true
                    }
                }
            }
        })

        const serializedAccounts = accounts.map(serializeTransaction);

        return { success: true, data: serializedAccounts };
    } catch (error) {

    }
}


// update default account
export async function updateDefaultAccount(accountId: string) {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId }
        })

        if (!user) {
            throw new Error("User not found")
        }

        // first, unset any default account
        await prisma.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true
            },
            data: { isDefault: false }
        })

        // Then set the new default account
        const account = await prisma.account.update({
            where: {
                id: accountId,
                userId: user.id
            },
            data: { isDefault: true }
        })

        // redirect to dashboard page
        revalidatePath("/dashboard")
        return { success: true, data: serializeTransaction(account) }
    } catch (error) {
        return { success: false, data: (error as Error).message }
    }
}


// get all account with transaction details
export async function getAllAccountWithTransactions(accountId: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId }
    })

    if (!user) {
        throw new Error("User not found")
    }

    // first find the account with the accountId
    const account = await prisma.account.findUnique({
        where: { id: accountId, userId: user.id },
        include: {
            transactions: {
                orderBy: {
                    date: "desc"
                }
            },
            _count: {
                select: { transactions: true }
            }
        }
    })


    if (!account) return null;

    return {
        ...serializeTransaction(account),
        transactions: account.transactions.map(serializeTransaction)
    }
}


// bulk delete transactions
export async function bulkDeleteTransactions(transactionIds: string[]) {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId }
        })

        if (!user) {
            throw new Error("User not found")
        }

        // find the transactions with transaction ids
        const transactions = await prisma.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id
            }
        })

        if (transactions.length === 0) {
            throw new Error("No transactions found to delete")
        }

        // after deleting calculate the account balance
        const accountBalanceChange: Record<string, number> = {}

        transactions.forEach(transaction => {
            const change = transaction.type === "EXPENSE" ? transaction.amount : -transaction.amount;
            accountBalanceChange[transaction.accountId] = (accountBalanceChange[transaction.accountId] || 0) + Number(change);

            /*
            accountBalanceChange = {
                "A1": 500 - 300  // +200
            };
            */
        })

        // delete transactions
        await prisma.transaction.deleteMany({
            // this is prisma's transaction not schema
            where: { id: { in: transactionIds } }
        })

        // update account balance
        const updatePromise = Object.entries(accountBalanceChange).map(([accountId, change]) => {
            return prisma.account.update({
                where: { id: accountId },
                data: { balance: { increment: change } }
                // Use increment: change so Prisma automatically adjusts the balance.
            })
        })

        await Promise.all(updatePromise)

        /*  Object.entries
        -----------------------
        accountBalanceChange = {
        "A1": 200,
        "A2": -300
        }
        - - - - - - - - - 
        * Object.entries(accountBalanceChange)
        [
        ["A1", 200],
        ["A2", -300]
        ]
        */

        //!  Bad Approach: Running Promises One by One
        /*
            async function updateBalances(balances) {
                for (const [accountId, change] of Object.entries(balances)) {
                    await prisma.account.update({
                        where: { id: accountId },
                        data: { balance: { increment: change } }
                    });
                }
            }
        */


        // revalidate path
        revalidatePath("/dashboard")
        revalidatePath("/account/[id]", "page")
        // revalidatePath() forces Next.js to refetch and re-render that page with updated data.

        // return the response
        return { success: true }

    } catch (error) {
        return {
            success: false,
            error: (error as Error).message
        }
    }

}   