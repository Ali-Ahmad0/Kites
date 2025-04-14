import { prisma } from "$lib/server/prisma.server.js";
import { error } from "@sveltejs/kit";

export async function load({ locals, params }: any) {
    const { post_id } = params;

    try {
        // Find the post from URL parameters
        const post = await prisma.forumPosts.findUnique({
            where: {
                id: post_id
            }
        });

        if (!post){
            throw error(
                404, {
                message:"Post not found"
            });
        };

        // Check if logged in user has liked the post
        let user_liked_bool: boolean = false;
        
        const user = locals.user;
        if (user) {
            const user_liked = await prisma.userLikes.findUnique({
                where: {
                    user_id_post_id: {
                        post_id: post.id,
                        user_id: user.id
                    }
                },
                select: { id: true }
            });
    
            user_liked_bool = user_liked !== null;
        }

        return {
            // Data regarding the post
            post_id: post.id,
            author: post.author_name,

            topic: post.topic,
            heading: post.heading,
            content: post.content,
        
            user_liked: user_liked_bool
        }
    }

    catch (e) {
        throw error(500, `Database Error: ${e}`);
    }

}