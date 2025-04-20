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
    
        // Get all post IDs
        const postIds = posts.map(post => post.id);
    
        // Fetch images for those post IDs
        const images = await prisma.forumImages.findMany({
            where: { post_id: { in: postIds } },
            select: {
                post_id: true,
                binary_blob: true,
                mime_type: true
            }
        });
    
        // Create a mapping from post ID → dataURL
        const imageMap: Record<string, string> = {};
        for (const img of images) {
            const base64 = Buffer.from(img.binary_blob).toString('base64');
            const dataUrl = `data:${img.mime_type};base64,${base64}`;
            imageMap[img.post_id] = dataUrl;
        }
        
        // Attach image URLs to the posts
        const posts_with_images = posts.map(post => ({
            ...post,
            imageUrl: imageMap[post.id] || null
        }));

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
            posts: posts_with_images.map((post, index) => ({
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