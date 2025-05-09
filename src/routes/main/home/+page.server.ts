import { fetch_posts, fetch_featured_posts } from '$lib/server/fetch.server.js';

export async function load({ locals }) {
    try {
        const [posts, featured_posts] = await Promise.all([
            fetch_posts(locals, undefined),
            fetch_featured_posts(locals)
        ]);
        
        return {
            ...posts, // regular posts array
            featured_posts // featured posts
        };
    } catch (e) {
        console.error("[KITES | ERROR]: Failed to fetch posts: ", e);
        return {
            posts: [],
            featured_posts: [] 
        };
    }
}