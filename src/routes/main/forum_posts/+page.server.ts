import { prisma } from "$lib/server/prisma.server";
import { get_session } from "$lib/server/session.server";
import { fail, type Actions } from "@sveltejs/kit";

export const actions : Actions = {
    create: async({ request, cookies }) => {
        try {
            const data = await request.formData();
            
            const heading = data.get('heading') as string;
            const content = data.get('content') as string

            const session_id = cookies.get('session') as string;
            const session_data = await get_session(session_id);
            const user_id = session_data?.user_id;

            if (user_id === undefined) {
                return fail(400, { success: false, message: "User must be signed in"});
            }

            await prisma.forumPosts.create({
                data: {
                    heading: heading,
                    content: content,
                    author_id: user_id,
                    topic: "Art",
                    likes: 0
                }
            })
   
        } catch (error) {
            return fail(500, { success: false, message: "Internal server error" });
        }
        

    }
}