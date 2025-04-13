
import { get_session } from "$lib/server/session.server";
import { fail, type Actions } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma.server";
import { error } from "@sveltejs/kit";

export async function load({ params }: any) {
    
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

    return { posts: posts }
}

export const actions : Actions = {
    create: async({ request, cookies }) => {
        try {
            // Get form data
            const data = await request.formData();
            
            const heading = data.get('heading') as string;
            const content = data.get('content') as string;
            const topic = data.get('topic') as string;

            // Check if user is signed in
            const session_id = cookies.get('session') as string;
            const session_data = await get_session(session_id);
            const user_id = session_data?.user_id;

            if (user_id === undefined) {
                return fail(400, { 
                    success: false, 
                    message: "User must be signed in"
                });
            }

            // Find user
            const user = await prisma.users.findUnique({
                where: { id:user_id }
            });

            if (!user) {
                return fail(400, { 
                    success: false,
                    message: "User does not exist"
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
