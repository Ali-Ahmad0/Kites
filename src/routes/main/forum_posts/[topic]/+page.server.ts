/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetch_posts, fetch_featured_posts } from "$lib/server/fetch.server";
import { error } from "@sveltejs/kit";

export async function load({ params, locals }: any) {
    try {
        const { topic } = params;

        if (!['Art', 'Science', 'Philosophy', 'Nature'].includes(topic)) {
            throw error(404, {
                message: "Topic does not exist"
            });
        }
    
        // Get both regular posts AND featured posts in parallel
        const [regularPosts, featuredPosts] = await Promise.all([
            fetch_posts(locals, topic),  
            fetch_featured_posts(locals) 
        ]);
    
        // Return combined result 
        return {
            ...regularPosts,       
            featured_posts: featuredPosts  
        };
    }
    catch (e) {
        console.error("[KITES | ERROR]: Failed to fetch posts: ", e);
        return {
            posts: [],
            featured_posts: [] 
        };
    }
}