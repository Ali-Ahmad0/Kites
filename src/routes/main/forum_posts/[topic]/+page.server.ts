
import { fail, type Actions } from "@sveltejs/kit";
import { prisma } from "$lib";
import { error } from "@sveltejs/kit";

export async function load({ locals, params }: any) {
    try {
        const { topic } = params;

        // Check for valid topic
        if (!['Art', 'Science', 'Philosophy', 'Nature'].includes(topic)) {
            throw error(
                404, {
                message: "Topic does not exist"
            })
        }
    
        // Return posts of that topic
        const posts = await prisma.forumPosts.findMany({
            where: { topic: topic }
        });
    
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
}

export const actions : Actions = {
    create: async({ request, locals }) => {
        try {
            // Get form data
            const data = await request.formData();
            
            const heading = data.get('heading') as string;
            const content = data.get('content') as string;
            const topic = data.get('topic') as string;

            // Check if user is signed in
            const user = locals.user;

            if (!user) {
                return fail(400, { 
                    success: false, 
                    message: "User must be signed in"
                });
            }

            // Create a new post
            await prisma.forumPosts.create({
                data: {
                    heading: heading,
                    content: content,
                    author_name: user.username,
                    topic: topic,
                    likes: 0
                }
            });

            return { success: true, message: "Post created successfully" };
   
        } catch (error) {
            return fail(500, { error: true, message: "Internal server error" });
        }
    }
}
