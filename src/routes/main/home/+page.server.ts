import { fetch_posts } from '$lib/server/fetch.server.js';

export async function load( { locals } ) {
    try {
        const posts = await fetch_posts(locals, undefined);
        return posts;
    } catch (e) {
          console.error("[KITES | ERROR]: Failed to fetch posts: ", e);
          return {
              posts: [],
          };
    }
};
