import { prisma } from '$lib/server/prisma.server';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        const data = await request.formData(); 
        const user = locals.user;

        if (!user) {
            return json(
                { error: 'User must be signed in' },
                { status: 401 }
            );
        }

        // Get new pfp data
        const image_file = data.get('image') as File;

        // check size of the pfp
        if(image_file.size > 3145728){
            return json(
                {error: 'Image is too large'},
                {status: 400}
            )
        }

        // Add pfp to database
        if (image_file && image_file.size > 0) {
        
            const array_buffer = await image_file.arrayBuffer();
            const buffer = Buffer.from(array_buffer); 
        
            // Check if user has pfp
            const pfp_exists = await prisma.userImages.findUnique({
                where: { username: user.username },
                select: { id: true }
            });

            // Create a new pfp record if needed
            if (!pfp_exists) {
                await prisma.userImages.create({
                    data: {
                        file_name: image_file.name,
                        mime_type: image_file.type ?? undefined,
                        size: image_file.size ?? undefined,
                        binary_blob: buffer,
                        username: user.username
                    }
                });
            }

            // Update existing pfp
            else {
                await prisma.userImages.update({
                    where: { username: user.username },
                    data: {
                        file_name: image_file.name,
                        mime_type: image_file.type ?? undefined,
                        size: image_file.size ?? undefined,
                        binary_blob: buffer,
                        username: user.username
                    }
                });
            }
        }
        
        return json({ success: true });
    } catch(e){
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
    }
}