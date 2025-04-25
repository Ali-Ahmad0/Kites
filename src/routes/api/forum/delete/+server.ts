import { prisma } from '$lib/server/prisma.server.js';
import { delete_session } from '$lib/server/session.server';
import { json } from '@sveltejs/kit';

export async function POST({ locals }) {
    try {
        
        

        return json({ success: true });
    
    } catch (error) {
        console.error('Deletion error:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}