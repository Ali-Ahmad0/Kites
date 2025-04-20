import { prisma } from "$lib/server/prisma.server";
import { error } from "@sveltejs/kit";

export async function load({ params, locals }: any) {
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
    }

    catch (error) {
        console.error("[KITES | ERROR]: Failed to fetch posts: ", error);
        return {
            posts: [] 
        };
    }
}

// export const actions : Actions = {
//     create: async({ request, locals }) => {
//     create: async ({ request, cookies, params }) => {
//         try {
//             const data = await request.formData();
            
//             const heading = data.get('heading') as string;
//             const content = data.get('content') as string;
//             const topic = data.get('topic') as string;
//             const imageFile = data.get('image') as File;
//             const topic = params.topic as string;
    
//             let file_name: string | null = null;
//             let mime_type: string | null = null;
//             let size: number | null = null;

//             // Check if user is signed in
//             const user = locals.user;

//             if (!user) {
//                 return fail(401, { 
//                     success: false, 
//                     message: "User must be signed in"
//                 });
//             const session_id = cookies.get('session') as string;
//             const session_data = await get_session(session_id);
//             const user_id = session_data?.user_id;
    
//             if (!user_id) {
//                 return fail(400, { success: false, message: "User must be signed in" });
//             }

//             // Create a new post
//             await prisma.forumPosts.create({
    
//             const user = await prisma.users.findUnique({
//                 where: { id: user_id }
//             });
    
//             if (!user) {
//                 return fail(400, { success: false, message: "User does not exist" });
//             }
    
//             if (!heading || !content) {
//                 return fail(400, { missing: true, message: "Provide heading and content" });
//             }
    
            
//             // Create the post and capture its ID
//             const post = await prisma.forumPosts.create({
//                 data: {
//                     heading: heading,
//                     content: content,
//                     author_name: user.username,
//                     topic: topic,
//                     likes: 0
//                 }
//             });

//             return { success: true, message: "Post created successfully" };
   
//         } catch (error) {
//             });
            
//             // create the image if there was one
//             if (imageFile && imageFile.size > 0) {
//                 file_name = imageFile.name;
//                 mime_type = imageFile.type;
//                 size = imageFile.size;
            
//                 const arrayBuffer = await imageFile.arrayBuffer();
//                 const buffer = Buffer.from(arrayBuffer); // this is a binary buffer
            
//                 await prisma.images.create({
//                     data: {
//                         file_name: file_name,
//                         mime_type: mime_type ?? undefined,
//                         size: size ?? undefined,
//                         binary_blob: buffer, // ← store binary directly
//                         post_id: post.id
//                     }
//                 });
//             }
//             return { success: true };
    
//         } catch (err) {
//             console.error(err);
//             return fail(500, { error: true, message: "Internal server error" });
//         }
//     }
// }    