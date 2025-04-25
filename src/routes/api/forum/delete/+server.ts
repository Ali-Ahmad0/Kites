import { prisma } from '$lib/server/prisma.server.js';
import { delete_session } from '$lib/server/session.server';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        
        const data = await request.json();
        const post_id = data.post_id;
        const author = data.author_name;

        if(locals.user?.username !== author || !locals.user || !locals.authenticated){
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

        if(!result) {
            return json(
                { error: 'Failed to delete user' },
                { status: 400 }
            );
        }
        
        return json({ success: true });
    
    } catch (e) {
        console.error('Deletion error:', e);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}