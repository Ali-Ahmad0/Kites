import { fetch_posts } from "$lib/server/fetch.server";
import { error } from "@sveltejs/kit";

export async function load({ params, locals }: any) {
    try {
        const { topic } = params;

        // Check for valid topic
        if (!['Art', 'Science', 'Philosophy', 'Nature'].includes(topic)) {
            throw error(
                404, {
                message: "Topic does not exist"
            })
        }
    
        const posts = await fetch_posts(locals, topic);
        return posts;
    }

    catch (e) {
        console.error("[KITES | ERROR]: Failed to fetch posts: ", error);
        return {
            posts: [] 
        };
    }
}