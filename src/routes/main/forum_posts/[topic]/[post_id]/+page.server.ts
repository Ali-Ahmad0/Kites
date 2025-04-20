import { prisma } from "$lib/server/prisma.server";
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

        // Fetch any comments on the post
        const comments = await prisma.forumPostComments.findMany({
            where: { post_id: post.id }
        });

        const image = await prisma.forumImages.findUnique({
            where: { post_id: post_id },
            select: {
                binary_blob: true,
                mime_type: true
            }
        });
        
        let data_url = null;
        if (image) {
            // Convert Prisma Bytes (Buffer) to base64
            const base64 = Buffer.from(image.binary_blob).toString('base64');
            data_url = `data:${image.mime_type};base64,${base64}`;
        }
        
        return {
            post_id: post.id,
            heading: post.heading,
            content: post.content,
            author: post.author_name,
            topic: post.topic,
            
            image: data_url,

            user_liked: user_liked_bool,            
            comments: comments
        }
    } catch (e) {
        throw error(500,`Database error: ${e}`);
    }
}