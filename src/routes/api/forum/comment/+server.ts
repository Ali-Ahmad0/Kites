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

        // Create a new comment
        await prisma.forumPostComments.create({
            data: {
                post_id: data.post_id,
                comment: data.comment,
                author_name: user.username
            }
        });

        return json({ success: true });
    } catch (e) {
        return json({ error: `Invalid request: ${e}` }, { status: 400 });
    }
}