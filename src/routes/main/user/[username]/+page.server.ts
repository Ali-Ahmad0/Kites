import { prisma } from '$db/prisma';
import { error } from '@sveltejs/kit';

export async function load({ params } : any) {
    // Access username from route parameters
    const { username } = params;

    const user = await prisma.users.findFirst({
        where: {
            username: username
        }
    })
    
    // Throw a 404 error if the user does not exist
    if (!user) {
        throw error(404, {
            message: 'User not found'
        });
    }

    const email = user.email;

    // Return username and email from parameters
    return {
        params_username: username,
        params_email_id: email 
    };
}