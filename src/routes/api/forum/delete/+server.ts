import { prisma } from '$lib/server/prisma.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        const data = await request.json();
        const post_id = data.post_id;
        const author = data.author_name;
        const post_type = data.type;
        const author_id = data.user_id;
        
        if (!locals.user || !locals.authenticated) {
            return json(
                { error: 'Failed to delete comment' },
                { status: 401 }
            );
        }

        const user = await prisma.users.findUnique({
            where: { id: locals.user.id },
            select: { rank: true }
        });

        // Only author or admin can delete post
        if (locals.user?.username !== author && user?.rank !== 'Admin') {
            return json(
                { error: 'Failed to delete post' },
                { status: 401 }
            );
        }

        // Handle deletion transaction
        await prisma.$transaction(async (t) => {
            // Delete the post
            await t.forumPosts.delete({
                where: { id: post_id }
            });
            
            if (locals.user?.username === author) {
                // Decrement the tokens
                const decrement_value = post_type === "Discussion" ? 10 : 30;
                await t.tokens.update({
                    where: { user_id: author_id },
                    data: {
                        tokens: { decrement: decrement_value }
                    }
                });
            }
        },
        {
            maxWait: 10000,
            timeout: 15000
        });

        return json({ success: true });
    
    } catch (e) {
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
    }
}