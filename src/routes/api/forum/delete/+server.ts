import { prisma } from '$lib/server/prisma.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        
        const data = await request.json();
        const post_id = data.post_id;
        const author = data.author_name;
        const post_type = data.type;
        const author_id = data.user_id; 

        // Validate the user
        if (locals.user?.username !== author || !locals.user || !locals.authenticated) {
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

            // Decrement the tokens
            const decrement_value = post_type === "Discussion" ? 10 : 30;
            await t.tokens.update({
                where: { user_id: author_id },
                data: {
                    tokens: { decrement: decrement_value }
                }
            });
        });

        return json({ success: true });
    
    } catch (e) {
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
  }
}