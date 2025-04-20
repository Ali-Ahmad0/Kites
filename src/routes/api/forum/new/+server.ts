import { prisma } from '$lib/server/prisma.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        const data = await request.formData();        
        const user = locals.user;
        
        // User must be signed in to create post
        if (!user) {
            return json(
                { error: 'User must be signed in' },
                { status: 401 }
            );
        }
        
        const imageFile = data.get('image') as File;
        console.log(imageFile.size);
        let file_name: string | null = null;
        let mime_type: string | null = null;
        let size: number | null = null;

        let post = await prisma.forumPosts.create({
            data: {
                heading: data.get('heading') as string,
                content: data.get('content') as string,
                author_name: user.username,
                topic: data.get('topic') as string,
                likes: 0
            }
        });

          // create the image if there was one
        if (imageFile && imageFile.size > 0) {
            file_name = imageFile.name;
            mime_type = imageFile.type;
            size = imageFile.size;
        
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer); 
        
            await prisma.forumImages.create({
                data: {
                    file_name: file_name,
                    mime_type: mime_type ?? undefined,
                    size: size ?? undefined,
                    binary_blob: buffer,
                    post_id: post.id
                }
            });
        }

        return json({ success: true });         
    } catch (e) {
        return json({ error: `Invalid request: ${e}` }, { status: 400 });
    }
}