
import { get_session } from "$lib/server/session.server";
import { fail, type Actions } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma.server";
import { error } from "@sveltejs/kit";
import fs from 'fs/promises';


export async function load({params}:any) {
    
    const {topic} = params;

    // if (!(topic in ['Art', 'Science', 'Philosophy', 'Nature'])) {
    //     throw error(
    //         404, {
    //         message:"Topic does not exist"
    //     })
    // }

    const posts = await prisma.forumPosts.findMany({
        where: {
            topic : topic
        }
    })

    return {
        posts: posts
    }
}

export const actions : Actions = {
    create: async({ request, cookies }) => {
        try {
            const data = await request.formData();
            // let imagePath = null;
            
            const heading = data.get('heading') as string;
            const content = data.get('content') as string;
            // const imageFile = data.get('image') as File;


            const session_id = cookies.get('session') as string;
            const session_data = await get_session(session_id);
            const user_id = session_data?.user_id;

            if (user_id === undefined) {
                return fail(400, { success: false, message: "User must be signed in"});
            }

            const user = await prisma.users.findUnique({
                    where: { id:user_id }
            });

            if (!user) {
                return fail(400, { success: false, message: "User does not exist"});
            }

            // if (!heading || !content) {
            //     return fail(400, { missing: true , message: "Provide heading and content"});
            // }

            // if (imageFile && imageFile.size > 0) {
            //     const buffer = Buffer.from(await imageFile.arrayBuffer());
            //     const filename = `${Date.now()}-${imageFile.name}`;
            //     const uploadPath = path.join('static/uploads', filename);
            //     await fs.writeFile(uploadPath, buffer);
            //     imagePath = `/uploads/${filename}`;
            // }

            await prisma.forumPosts.create({
                data: {
                    heading: heading,
                    content: content,
                    author_name: user.username,
                    topic: "Art",
                    likes: 0
                }
            })

            // await prisma
   
        } catch (error) {
            return fail(500, { success: false, message: "Internal server error" });
        }
        

    }
}
