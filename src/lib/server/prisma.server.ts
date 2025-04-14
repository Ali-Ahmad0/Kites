import { PrismaClient } from '@prisma/client';
import { env } from '$env/dynamic/private';

// Create a global variable to store the prisma instance
const global_prisma = globalThis as unknown as { prisma: PrismaClient };

// Create the prisma client
export const prisma = global_prisma.prisma || new PrismaClient();

if (env.NODE_ENV !== 'production') {
    global_prisma.prisma = prisma;
}