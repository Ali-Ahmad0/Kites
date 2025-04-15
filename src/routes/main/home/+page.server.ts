import { prisma } from '$lib/server/prisma.server';

export async function load({ locals }) {
    try {
      // Fetch posts from all topics
      const posts = await prisma.forumPosts.findMany({});

      // Check user like status for posts
      let like_status = [];

      const user = locals.user;
      for (const post of posts) {
          if (user) {
              const user_liked = await prisma.userLikes.findUnique({
                  where: {
                      user_id_post_id: {
                          user_id: user.id,
                          post_id: post.id
                      }
                  },
                  select: { id: true }
              });

              like_status.push(user_liked !== null)
          } else {
              like_status.push(false);
          }
      }

      return {
          posts: posts.map((post, index) => ({
              ...post,
              user_liked: like_status[index] // Attach like status directly to each post
          }))
      };
    } 
    catch (error) {
        console.error("[KITES | ERROR]: Failed to fetch posts: ", error);
        return {
            posts: [] 
        };
    }
};