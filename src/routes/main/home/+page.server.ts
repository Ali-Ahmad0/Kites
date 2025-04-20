import { prisma } from '$lib/server/prisma.server';

export const load = async () => {
  try {
    const posts = await prisma.forumPosts.findMany({
      take: 10,
    });

    const postsWithImages = await Promise.all(
      posts.map(async (post) => {
        const image = await prisma.images.findFirst({
          where: { post_id: post.id },
          select: {
            binary_blob: true,
            mime_type: true,
          },
        });

        let imageUrl = null;
        if (image) {
          const base64 = Buffer.from(image.binary_blob).toString('base64');
          imageUrl = `data:${image.mime_type};base64,${base64}`;
        }

        return {
          ...post,
          imageUrl, // Attach image to post
        };
      })
    );

    return {
      posts: postsWithImages,
    };
  } catch (error) {
    console.error("[KITES | ERROR]: Failed to fetch posts: ", error);
    return {
      posts: [],
    };
  }
};
