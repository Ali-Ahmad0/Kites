import { json } from '@sveltejs/kit';
import { delete_session } from '$lib/server/session.server';

export async function POST({ cookies }) {
    try {
        // Get the session ID from cookies
        const session = cookies.get('session');
    
        if (session) {
            // Delete the session
            await delete_session(session);
            cookies.delete('session', {path: '/',});
        }
    
        return json({ success: true });
    
    } catch (error) {
        console.error('Logout error:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}