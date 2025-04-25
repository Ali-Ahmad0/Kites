import { json } from '@sveltejs/kit';
import { delete_session } from '$lib/server/session.server';

export async function POST({ cookies, locals }) {
    try {
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
        console.error('[KITES | ERROR]: ', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}