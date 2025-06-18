import { prisma } from "$lib/server/prisma.server";
import { error, type RequestEvent } from "@sveltejs/kit";

export async function load({ locals }: RequestEvent) {
    try {

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
    
        // Get tokens for user
        let token_data = null;
        if (locals.user && locals.authenticated) {
            token_data = await prisma.tokens.findUnique({
                where: { user_id: locals.user.id },
                select: { tokens: true }
            });
        }
      
        return {
            my_pfp: image_url,
            tokens: token_data ? token_data.tokens : 0
        };
    } catch (e) {
        console.error("[KITES | ERROR]: ", e);
        throw error(500, "Interal Server Error");
    }
};