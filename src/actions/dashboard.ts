"use server"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Account } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { AccountFormType } from "@/app/lib/schema"; 

// Helper to serialize Prisma Decimal to string/number
const serializeTransaction = (obj: any) => {
    const serialized = { ...obj }
    
    // Convert Prisma Decimal to string to preserve precision
    if (obj.balance instanceof Prisma.Decimal) {
        serialized.balance = obj.balance.toString()
    }

    if (obj.amount instanceof Prisma.Decimal) {
        serialized.amount = obj.amount.toString()
    }
    
    return serialized
}

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
    } catch (error) {
        
    }
}