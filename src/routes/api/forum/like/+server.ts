import { prisma } from '$lib/server/prisma.server';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        const data = await request.json();        
        const user = locals.user;
       
        // User must be signed in to like post
        if (!user) {
            return json(
                { error: 'User must be signed in' },
                { status: 401 }
            );
        }
        
        // Handle like
        if (data.action === 'like') {
            // Increment like count
            await prisma.forumPosts.update({
                where: { id: data.post_id },
                data: {
                    likes: { increment: 1 }
                }
            });

            // Keep record of user like
            await prisma.forumLikes.create({
                data: {
                    user_id: user.id, 
                    post_id: data.post_id
                }
            })
        }

        // Handle dislike
        else {
            // Decrement like count
            await prisma.forumPosts.update({
                where: { id: data.post_id },
                data: {
                    likes: { decrement: 1 }
                }
            })

            // Delete record of user like
            await prisma.forumLikes.delete({
                where: {
                    user_id_post_id: {
                        user_id: user.id, 
                        post_id: data.post_id
                    }
                }
            })
        }

        return json({ success: true });
    }
    catch (e) {
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
    }
}