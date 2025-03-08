import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

const globalForPrisma = global as unknown as { prisma: typeof prisma }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma



// import { PrismaClient } from '@prisma/client'

// declare global {
//     let prisma: PrismaClient;
// }

// const db = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

// export default db