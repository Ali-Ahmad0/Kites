import { get_session } from "$lib";
import { redirect } from "@sveltejs/kit";
import { prisma } from "$db/prisma";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    // Initialize events.locals
    event.locals = { user: null, authenticated: false };

    // Extract session_id from cookies
    const session_id = event.cookies.get("session");

    // Check if session exists
    if (session_id) {
        const session = await get_session(session_id);

        // If session exists, add user_id to locals
        if (session) {

            const user = await prisma.users.findFirst({
                where: {
                    id: session.user_id
                }
            })

            // @ts-ignore
            event.locals.user = { id: session.user_id, username: user.username };
            event.locals.authenticated = true;
        } else {
            // Delete session if it is invalid
            event.cookies.delete("session", { path: "/" });
        }
    }

    // Protect routes
    if (event.url.pathname.startsWith("/main/posts") && !event.locals.user) {
         throw redirect(303, "/login/signin");
    }

    return resolve(event);
}
