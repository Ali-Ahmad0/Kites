import { prisma } from '$lib/server/prisma.server';
import { error } from '@sveltejs/kit';

export async function load({ params } : any) {
    // Access username from route parameters
    const { username } = params;
    
    const user = await prisma.users.findUnique({
        where: {
            username: username
        },
        select: { id: true, email: true }
    })
    
    // Throw a 404 error if the user does not exist
    if (!user) {
        throw error(404, {
            message: 'User not found'
        });
    }
    
    const email = user.email;

    const image = await prisma.userImages.findFirst({
        where: { username: username },
        select: {
            binary_blob: true,
            mime_type: true
        }
    });
    
    let data_url = null;
    if (image) {
        // Convert Prisma Bytes (Buffer) to base64
        const base64 = Buffer.from(image.binary_blob).toString('base64');
        data_url = `data:${image.mime_type};base64,${base64}`;
    }
    
    // Return username and email from parameters
    return {
        params_username: username,
        params_email_id: email,
        image: data_url
    };
}