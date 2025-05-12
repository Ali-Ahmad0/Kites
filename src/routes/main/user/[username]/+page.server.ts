import { prisma } from '$lib/server/prisma.server';
import { error } from '@sveltejs/kit';

export async function load({ params } : any) {
    // Access username from route parameters
    const { username } = params;
    
    const streamed = (async () => { 
        const user = await prisma.users.findUnique({
            where: { username: username },
            select: {
                username: true,
                rank: true,
                email: true,
                image: {
                    select: { binary_blob: true, mime_type: true }
                }
            }
        })
        
        // Throw a 404 error if the user does not exist
        if (!user) {
            throw error(404, {
                message: 'User not found'
            });
        }
        
        const email = user.email;
        const rank = user.rank;
        
        let image_url = null;
        if (user.image) {
            // Convert Prisma Bytes (Buffer) to base64
            const base64 = Buffer.from(user.image.binary_blob).toString('base64');
            image_url = `data:${user.image.mime_type};base64,${base64}`;
        }

        return {
            email: user.email,
            rank: user.rank,
            image: image_url
        };
    })();
    // Return username and email from parameters
    return {
        params_username: username,
        streamed
    };
}