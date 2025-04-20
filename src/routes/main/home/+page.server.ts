import { prisma } from '$lib/server/prisma.server';

export async function load( { locals } ) {
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

        // Check user like status for posts
        let like_status = [];
        let author_pfps = [];
    
        const user = locals.user;
        for (const post of posts) {
            // Check like status for current user
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

            // Get author pfp for the post
            const author_pfp = await prisma.userImages.findUnique({
                where: { username: post.author_name }
            });

            let author_pfp_url = null;
            if (author_pfp) {
                const base64 = Buffer.from(author_pfp.binary_blob).toString('base64');
                author_pfp_url = `data:${author_pfp.mime_type};base64,${base64}`;
            }

            author_pfps.push(author_pfp_url);
        }
    
        return {
            posts: posts_with_images.map((post, index) => ({
                ...post,
                author_pfp: author_pfps[index], // Attatch pfp of author
                user_liked: like_status[index] // Attach like status directly to each post
            }))
        };
    } catch (error) {
          console.error("[KITES | ERROR]: Failed to fetch posts: ", error);
          return {
              posts: [],
          };
    }
};
