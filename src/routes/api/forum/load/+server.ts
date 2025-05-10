import { json } from '@sveltejs/kit';
import { fetch_posts } from '$lib/server/fetch.server';

export async function GET({ url, locals }) {
    const page = parseInt(url.searchParams.get('page') || '1');
    const topic = url.searchParams.get('topic') || undefined;

    // Fetch posts for the next page
    const result = await fetch_posts(locals, topic, page);
    
    return json(result);
}