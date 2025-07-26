import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    var prisma;
}

export const db = globalThis.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV != "production") globalThis.prisma = db;