import { prisma } from '$lib/server/prisma.server';

export const load = async () => {
  try {
    const posts = await prisma.forumPosts.findMany({
      take: 10, 
    });

    return {
      posts: posts
    };
  } 
  catch (error) {
    console.error("[KITES | ERROR]: Failed to fetch posts: ", error);
    return {
      posts: [] 
    };
  }
};