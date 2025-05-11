import { prisma } from "$lib/server/prisma.server";

export async function load({ locals }) {
    // Fetch the rank from the database
    const user = await prisma.users.findFirst ({
        where: { id: locals.user?.id },
        select: { rank: true }
    })

    return {
        user: locals.user,
        authenticated: locals.authenticated,
        rank: user ? user.rank : null
    };
};