import { prisma } from '$lib/server/prisma.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        const data = await request.json();
        const user = locals.user;
    
        // User must be signed in to comment
        if (!user) {
            return json(
                { error: 'User must be signed in' },
                { status: 401 }
            );
        }

        const rank = data.rank;
        
        // Update user's rank in the database
        await prisma.users.update({
            where: {
                id: user.id
            },
            data: {          
                rank: rank  
            }
        });

        return json({ success: true });
    } catch (e) {
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
    }
}