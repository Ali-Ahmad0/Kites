/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { prisma } from "$lib/server/prisma.server";

// Fetching featured posts
export async function fetch_featured_posts() {
    const posts = await prisma.forumPosts.findMany({
        take: 5,
        orderBy: { likes: 'desc' },
        include: {
            // Get author profile picture
            author: {
                select: {
                    image: {
                        select: { binary_blob: true, mime_type: true }
                    }
                }
            }
        }
    });

    // Attatch profile picture URL to the post
    const processed_posts = await Promise.all(
        posts.map(async (post) => {
            const pfp = post.author.image;

            return {
                ...post,
                author_pfp: pfp 
                    ? `data:${pfp.mime_type};base64,${Buffer.from(pfp.binary_blob).toString('base64')}`
                    : null
            };
        })
    );

    return processed_posts;
}

// Fetch all posts
export async function fetch_posts(locals: any, topic: string | undefined, page: number = 1) {
    const user = locals.user;

    let posts = await prisma.forumPosts.findMany({
        where: topic ? { topic: topic } : {},
        orderBy: { likes: 'desc' },
        // Take 10 posts per page
        skip: (page - 1) * 10,
        take: 10,
        include: {
            // Get cover image
            image: {
                select: { binary_blob: true, mime_type: true }
            },

            // Get author profile picture
            author: {
                select: {
                    image: {
                        select: { binary_blob: true, mime_type: true }
                    }
                }
            },

            // Get user like status
            user_likes: user ? {
                where: { user_id: user.id },
                select: { id: true }
            } : false
        }
    });

    // Attatch cover image, author pfp and like status to the posts
    const processed_posts = await Promise.all(
        posts.map(async (post) => {
            const cover_image = post.image;
            
            // Get post cover image
            let cover_url = null;
            if (cover_image) {
                const base64 = Buffer.from(cover_image.binary_blob).toString('base64');
                cover_url = `data:${cover_image.mime_type};base64,${base64}`;
            }
            
            // Get author pfp
            const author_pfp = post.author.image;
            let pfp_url = null;
            if (author_pfp) {
                const base64 = Buffer.from(author_pfp.binary_blob).toString('base64');
                pfp_url = `data:${author_pfp.mime_type};base64,${base64}`;
            }

            return {
                ...post,
                image_url: cover_url,
                author_pfp: pfp_url,
                user_liked: post.user_likes ? post.user_likes.length > 0 : false
            };
        })
    );
    
    return { posts: processed_posts };
}