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

        let comment_author_pfps = [];
        for (const comment of comments) {
            const comment_author_pfp = await prisma.userImages.findUnique({
                where: { username: comment.author_name },
                select: {
                    binary_blob: true,
                    mime_type: true
                }
            });

            let comment_author_pfp_url = null;
            if (comment_author_pfp) {
                const base64 = Buffer.from(comment_author_pfp.binary_blob).toString('base64');
                comment_author_pfp_url = `data:${comment_author_pfp.mime_type};base64,${base64}`;
            }

            comment_author_pfps.push(comment_author_pfp_url);
        }

        const comments_with_pfps = comments.map((comment, index) => ({
            ...comment,
            author_pfp: comment_author_pfps[index]
        }));

        const image = await prisma.forumImages.findUnique({
            where: { post_id: post_id },
            select: {
                binary_blob: true,
                mime_type: true
            }
        });

        let image_url = null;
        if (image) {
            const base64 = Buffer.from(image.binary_blob).toString('base64');
            image_url = `data:${image.mime_type};base64,${base64}`;
        }

        const author_pfp = await prisma.userImages.findUnique({
            where: { username: post.author_name }
        })

        let author_pfp_url = null;
        if (author_pfp) {
            const base64 = Buffer.from(author_pfp.binary_blob).toString('base64');
            author_pfp_url = `data:${author_pfp.mime_type};base64,${base64}`;
        }
        
        return {
            post_id: post.id,
            heading: post.heading,
            content: post.content,
            author: post.author_name,
            topic: post.topic,
            
            author_pfp: author_pfp_url,
            image: image_url,

            user_liked: user_liked_bool,            
            comments: comments_with_pfps
        }
    } catch (e) {
        throw error(500,`Database error: ${e}`);
    }
}