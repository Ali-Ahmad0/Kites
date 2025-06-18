/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetch_posts, fetch_featured_posts } from "$lib/server/fetch.server";
import { error } from "@sveltejs/kit";

export async function load({ params, locals }: any) {
    const { topic } = params;

    if (!['Art', 'Science', 'Philosophy', 'Nature'].includes(topic)) {
        throw error(404, { message: "Topic does not exist" });
    }

    // Get both regular posts and featured posts
    const streamed = (async () => {
        try {
            const [posts, featured_posts] = await Promise.all([
                fetch_posts(locals, topic),
                fetch_featured_posts()
            ]);
            
            return {
                ...posts,
                featured_posts
            };
        } catch (e) {
            console.error("[KITES | ERROR]: Failed to fetch posts: ", e);
            throw error(500, { message: "Internal Server Error" });
        }
    })();
    
    return { streamed };
}