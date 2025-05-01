import { prisma } from '$lib/server/prisma.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        
        const data = await request.json();
        const post_id = data.post_id;
        const author = data.author_name;
        const post_type = data.type;
        const author_id = data.user_id; 

        if (locals.user?.username !== author || !locals.user || !locals.authenticated) {
            return json(
                { error: 'Failed to delete post' },
                { status: 401 }
            );
        }

        // delete the post
        const result = await prisma.forumPosts.delete({
            where: {
                id: post_id
            }
        })

        if (!result) {
            return json(
                { error: 'Failed to delete post' },
                { status: 400 }
            );
        }

        // decrement the tokens as well
        if (post_type === "discussion") {

            await prisma.tokens.update({
                where: { user_id: author_id },
    
                data: { 
                    tokens: { decrement: 10 } 
                }
            });
        } else {
            await prisma.tokens.update({
                where: { user_id: author_id },
    
                data: { 
                    tokens: { decrement: 30 } 
                }
            });
        }

        return json({ success: true });
    
    } catch (e) {
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
  }
}