import { prisma } from '$lib/server/prisma.server.js';
import { delete_session } from '$lib/server/session.server';
import { json } from '@sveltejs/kit';

export async function POST({ cookies, locals }) {
    try {

        if(!locals.user || !locals.authenticated) {
            return json(
                { error: 'User must be signed in' },
                { status: 401 }
            );
        }

        // delete user and corresponding data
        const result = await prisma.users.delete({
            where: {
                id: locals.user?.id
            }
        });

        if(!result) {
            return json(
                { error: 'Failed to delete user' },
                { status: 400 }
            );
        }

        // Get the session ID from cookies
        const session = cookies.get('session');
    
        if (session) {
            // Delete the session
            await delete_session(session);
            cookies.delete('session', {path: '/',});
        }
        
        locals.user = null;
        locals.authenticated = false;
        return json({ success: true });
    
    } catch (error) {
        console.error('Deletion error:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}