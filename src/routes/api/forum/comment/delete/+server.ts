import { prisma } from '$lib/server/prisma.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        
        const data = await request.json();
        const comment_id = data.comment_id;
        const author = data.author_name;

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

        // Only admin or author can delete comment
        if (locals.user?.username !== author && user?.rank !== 'Admin') {
            return json(
                { error: 'Failed to delete comment' },
                { status: 401 }
            );
        }

        // Delete the comment
        const result = await prisma.forumComments.delete({
            where: { id: comment_id }
        })

        if (!result) {
            return json(
                { error: 'Failed to delete comment' },
                { status: 400 }
            );
        }
        
        return json({ success: true });
    
    } catch (e) {
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}