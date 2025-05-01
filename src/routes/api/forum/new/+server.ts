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
        
        // Get picture for post
        const image_file = data.get('image') as File;

        // check size of picture
        if(image_file && image_file.size > 5242880){
            return json(
                { error: 'Image is too large' },
                { status: 400 }
            )
        }

        // remove malicious content before adding into the database
        let post = await prisma.forumPosts.create({
            data: {
                heading: data.get('heading') as string,
                content: data.get('content') as string,
                author_name: user.username,
                topic: data.get('topic') as string,
                type: data.get('type') as string
            }
        });

          // create the image if there was one
        if (image_file) {
            const array_buffer = await image_file.arrayBuffer();
            const buffer = Buffer.from(array_buffer); 
        
            await prisma.forumImages.create({
                data: {
                    file_name: image_file.name,
                    mime_type: image_file.type ?? undefined,
                    size: image_file.size ?? undefined,
                    binary_blob: buffer,
                    post_id: post.id
                }
            });
        }

        const tokens = await prisma.tokens.findUnique({
            where: { user_id: user.id },
            select: { id: true }
        });

        // Create token record if not exists
        if (!tokens) {
            await prisma.tokens.create({
                data: { user_id: user.id }
            });
        }

        // Add 10 tokens for creating a discussion post
        if (data.get('type') === "discussion") {
            await prisma.tokens.update({
                where: { user_id: user.id },
    
                data: { 
                    tokens: { increment: 10 } 
                }
            });
        }

        // Add 30 tokens for creating a blog post
        else {
            await prisma.tokens.update({
            where: {user_id: user.id},

            data: {   
                tokens: { increment: 30 }
            }
        })
    }
        return json({ success: true });         
    } catch (e) {
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
    }
}