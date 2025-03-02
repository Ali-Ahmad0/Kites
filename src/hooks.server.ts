import { db_connect } from "$db/mongo";
import { get_session } from "$lib/helper/session";
import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";

// Connect to the database
db_connect().then(() : void => {
    console.log("[KITES | INFO]: Connected to database succesfully!");
}).catch(e => {console.error("[KITES | ERROR]: Unable to connect to database: " + e)})

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
            event.locals.user = { id: session.user_id };
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
