import { prisma } from "$lib/server/prisma.server";
import { error } from "@sveltejs/kit";

export async function load({ locals, params }) {
    const { post_id } = params;
    const user = locals.user;

    try {
        const streamed = (async () => {
            // Find the post from URL parameters
            const post = await prisma.forumPosts.findUnique({
                where: { id: post_id },
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
                        where: { user_id: user.id }
                    } : false,
    
                    // Get comment data
                    forum_comments: {
                        take: 5,
                        include: {
                            author: {
                                select: {
                                    image: {
                                        select: { binary_blob: true, mime_type: true }
                                    }
                                }
                            }
                        }
                    }
                }
            });
    
            if (!post) {
                throw error(
                    404, {
                    message:"Post not found"
                });
            };
    
            // Attatch author pfp url to comment
            const comments_with_pfps = post.forum_comments.map(comment => ({
                ...comment,
                author_pfp: comment.author?.image 
                    ? `data:${comment.author.image.mime_type};base64,${Buffer.from(comment.author.image.binary_blob).toString('base64')}`
                    : null
            }));
            
            const cover_image = post.image;
            const author_pfp = post.author.image;
    
            return {
                // Remove duplicate comment data
                post: { ...post, forum_comments: undefined },
    
                image: cover_image
                    ? `data:${cover_image.mime_type};base64,${Buffer.from(cover_image.binary_blob).toString('base64')}`
                    : null,
                
                user_id : user ? user.id : null,  
                user_liked: post.user_likes ? post.user_likes.length > 0 : false,            
                
                author_pfp: author_pfp 
                    ? `data:${author_pfp.mime_type};base64,${Buffer.from(author_pfp.binary_blob).toString('base64')}`
                    : null,
                
                comments: comments_with_pfps
            }
        })();
        
        return { streamed };
    } catch (e) {
        throw error(500,`[KITES | ERROR]: ${e}`);
    }
}