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

        const rank: string = data.rank;

        // check if user has enough tokens
        const token_data = await prisma.tokens.findUnique({
            where: { user_id: user.id },
            select: { tokens: true }
        });


        const prices: { [key: string]: number } = {
            "Bronze": 1000,
            "Silver": 3000,
            "Golden": 5000
        }

        if(!(token_data?.tokens && token_data.tokens >= prices[rank])) {
            return json(
                { error: 'Not enough Tokens' },
                { status: 400 }
            );
        }
        
        // Update user's rank in the database
        await prisma.users.update({
            where: { id: user.id },
            data: { rank: rank }
        });

        return json({ success: true });
    } catch (e) {
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
    }
}