import { prisma } from '$lib/server/prisma.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    try {
        const data = await request.formData();
        const user = locals.user;

        // User must be signed in to create post
        if (!user) {
            return json(
                { error: 'User must be signed in' },
                { status: 401 }
            );
        }

        // Get picture for post
        const image_file = data.get('image') as File;

        // Check size of picture
        if (image_file && image_file.size > 5242880) {
            return json(
                { error: 'Image is too large' },
                { status: 400 }
            );
        }

        // Handle creation transaction
        const result = await prisma.$transaction(async (t) => {
            // Create the post
            const post = await t.forumPosts.create({
                data: {
                    heading: data.get('heading') as string,
                    content: data.get('content') as string,
                    author_name: user.username,
                    topic: data.get('topic') as string,
                    type: data.get('type') as string
                }
            });

            // Store the image if there was one
            if (image_file) {
                const array_buffer = await image_file.arrayBuffer();
                const buffer = Buffer.from(array_buffer);

                await t.forumImages.create({
                    data: {
                        file_name: image_file.name,
                        mime_type: image_file.type ?? undefined,
                        size: image_file.size ?? undefined,
                        binary_blob: buffer,
                        post_id: post.id
                    }
                });
            }

            // Check if tokens record exists for the user
            const tokens = await t.tokens.findUnique({
                where: { user_id: user.id },
                select: { id: true }
            });

            // Create token record if not exists
            if (!tokens) {
                await t.tokens.create({
                    data: { user_id: user.id }
                });
            }

            // Add tokens based on post type
            const increment_value = data.get('type') === "Discussion" ? 10 : 30;
            await t.tokens.update({
                where: { user_id: user.id },
                data: {
                    tokens: { increment: increment_value }
                }
            });

            // Return ID of the created post
            return post;
        });

        return json({ success: true, post_id: result.id, topic: result.topic });

    } catch (e) {
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
    }
}
