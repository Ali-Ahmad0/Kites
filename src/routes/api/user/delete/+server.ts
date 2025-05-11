import { prisma } from '$lib/server/prisma.server.js';
import { delete_session } from '$lib/server/session.server';
import { json } from '@sveltejs/kit';

export async function POST({ cookies, request, locals }) {
    try {
        // Get username of user to delete
        const data = await request.json();
        const username = data.username;

        if(!locals.user || !locals.authenticated) {
            return json(
                { error: 'User must be signed in' },
                { status: 401 }
            );
        }

        const user = await prisma.users.findUnique({
            where: { id: locals.user.id },
            select: { rank: true }
        });

        // Validate user
        if (locals.user.username !== username && user?.rank !== 'Admin') {
            return json(
                { error: 'Failed to delete user' },
                { status: 401 }
            );
        }

        // Delete user and corresponding data
        const result = await prisma.users.delete({
            where: { username: username }
        });

        if(!result) {
            return json(
                { error: 'Failed to delete user' },
                { status: 400 }
            );
        }

        // If deleting own account, remove session
        if (locals.user.username === username) {
            // Get the session ID from cookies
            const session = cookies.get('session');
        
            if (session) {
                // Delete the session
                await delete_session(session);
                cookies.delete('session', {path: '/',});
            }
            
            locals.user = null;
            locals.authenticated = false;
        }
        
        return json({ success: true });
    } catch (e) {
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
  }
}