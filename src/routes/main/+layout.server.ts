import { prisma } from "$lib/server/prisma.server";
import type { RequestEvent } from "@sveltejs/kit";

export const load = async ({ locals }: RequestEvent) => {
    // Get user profile picture URL
    let image_url = null
    
    if (locals.user && locals.authenticated) {
        const image = await prisma.userImages.findUnique({
            where: { username: locals.user.username },
            select: {
                binary_blob: true,
                mime_type: true
            }
        });

        if (image) {
            // Convert Prisma Bytes (Buffer) to base64
            const base64 = Buffer.from(image.binary_blob).toString('base64');
            image_url = `data:${image.mime_type};base64,${base64}`;
        }
    }
  
    return {
        my_pfp: image_url
    };
};