import { fetch_posts, fetch_featured_posts } from '$lib/server/fetch.server.js';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    const streamed = (async () => {
        try {
            const [posts, featured_posts] = await Promise.all([
                fetch_posts(locals, undefined),
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