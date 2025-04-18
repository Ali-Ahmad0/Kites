import { prisma } from '$lib/server/prisma.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        const data = await request.json();        
        const user = locals.user;
        
        // User must be signed in to create post
        if (!user) {
            return json(
                { error: 'User must be signed in' },
                { status: 401 }
            );
        }

        await prisma.forumPosts.create({
            data: {
                heading: data.heading,
                content: data.content,
                author_name: user.username,
                topic: data.topic,

                likes: 0
            }
        });

        return json({ success: true });         
    } catch (e) {
        return json({ error: `Invalid request: ${e}` }, { status: 400 });
    }
}