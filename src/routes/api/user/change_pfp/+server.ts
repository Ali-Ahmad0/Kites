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
        let file_name: string | null = null;
        let mime_type: string | null = null;
        let size: number | null = null;

        // Add pfp to database
        if (image_file && image_file.size > 0) {
            file_name = image_file.name;
            mime_type = image_file.type;
            size = image_file.size;
        
            const array_buffer = await image_file.arrayBuffer();
            const buffer = Buffer.from(array_buffer); 
        
            // Check if user has pfp
            const pfp_exists = await prisma.userImages.findUnique({
                where: { user_id: user.id },
                select: { id: true }
            });

            // Create a new pfp record if needed
            if (!pfp_exists) {
                await prisma.userImages.create({
                    data: {
                        file_name: file_name,
                        mime_type: mime_type ?? undefined,
                        size: size ?? undefined,
                        binary_blob: buffer,
                        user_id: user.id
                    }
                });
            }

            // Update existing pfp
            else {
                await prisma.userImages.update({
                    where: { user_id: user.id },
                    data: {
                        file_name: file_name,
                        mime_type: mime_type ?? undefined,
                        size: size ?? undefined,
                        binary_blob: buffer,
                        user_id: user.id
                    }
                });
            }
        }
        
        return json({ success: true });
    } catch(e){
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}