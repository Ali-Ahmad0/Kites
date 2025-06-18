import { prisma } from "$lib/server/prisma.server";
import { error } from "@sveltejs/kit";

export async function load({ locals }) {
    try {
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
    } catch (e) {
        console.error("[KITES | ERROR]: ", e);
        throw error(500, { message: "Internal Server Error" });
    }   
};