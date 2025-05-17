/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '$lib/server/prisma.server';
import { error } from '@sveltejs/kit';
import { get_dashboard_data } from '$lib/server/dashboard.server';

export async function load({ params }) {
    // Access username from route parameters
    const { username } = params;
    
    // Check user existence
    const user = await prisma.users.findUnique({
        where: { username: username },
        select: { id: true }
    });

    if (!user) {
        throw error(404, 'User not found')
    }

    const streamed = (async () => {
        try {
            // Get all user data
            const user = await prisma.users.findUnique({
                where: { username: username },
                select: {
                    username: true,
                    rank: true,
                    email: true,
                    image: {
                        select: { binary_blob: true, mime_type: true }
                    }
                }
            });

            if (!user) {
                return {};
            }
            
            const email = user.email;
            const rank = user.rank;
            
            let image_url = null;
            if (user.image) {
                // Convert Prisma Bytes (Buffer) to base64
                const base64 = Buffer.from(user.image.binary_blob).toString('base64');
                image_url = `data:${user.image.mime_type};base64,${base64}`;
            }
            
            // Get admin dashboard stats
            const dashboard_data = await get_dashboard_data(user.rank);
    
            // Return profile page data
            return {
                email: email,
                rank: rank,
                image: image_url,
                admin_stats: dashboard_data
            };
        } catch (e) {
            console.error('[KITES | ERROR]: ', e);
        }
    })();
    
    return { streamed };
}