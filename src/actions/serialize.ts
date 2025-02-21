import { Prisma } from "@prisma/client"

// Helper to serialize Prisma Decimal to string/numbere
export const serializeTransaction = (obj: any) => {
    const serialized = { ...obj }

    // Convert Prisma Decimal to string to preserve precision
    if (obj.balance instanceof Prisma.Decimal) {
        serialized.balance = obj.balance.toNumber()
    }

    if (obj.amount instanceof Prisma.Decimal) {
        serialized.amount = obj.amount.toNumber()
    }

    return serialized
}