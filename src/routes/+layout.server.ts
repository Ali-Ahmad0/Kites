import { prisma } from "$lib/server/prisma.server";
import type { RequestEvent } from "@sveltejs/kit";

export const load = async ({ locals }: RequestEvent) => {

    // fetch the rank from the database
    const rank = await prisma.users.findFirst ({
        where: { id: locals.user?.id},
        select: { rank: true}
    })

    return {
        user: locals.user,
        authenticated: locals.authenticated,
        rank: rank
    };
};