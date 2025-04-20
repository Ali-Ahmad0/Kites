import { prisma } from '$lib/server/prisma.server';

export const load = async () => {
    try {
        const posts = await prisma.forumPosts.findMany({});

        const posts_with_images = await Promise.all(
            posts.map(async (post) => {
                const image = await prisma.forumImages.findUnique({
                    where: { post_id: post.id },
                    select: {
                      binary_blob: true,
                      mime_type: true,
                    },
              });

            let image_url = null;
            if (image) {
                const base64 = Buffer.from(image.binary_blob).toString('base64');
                image_url = `data:${image.mime_type};base64,${base64}`;
            }

            return {
                ...post,
                image_url: image_url, // Attach image to post
            };
          })
        );

        return {
            posts: posts_with_images,
        };
    } catch (error) {
          console.error("[KITES | ERROR]: Failed to fetch posts: ", error);
          return {
              posts: [],
          };
    }
};
