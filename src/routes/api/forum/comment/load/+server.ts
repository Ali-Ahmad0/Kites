import { prisma } from "$lib/server/prisma.server"
import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = async ({ url }) => {
    const post_id = url.searchParams.get("post_id");
    const page = Number.parseInt(url.searchParams.get("page") || "1");

    if (!post_id) {
        throw error(400, { message: "Missing post_id parameter" });
    }

    try {
        const skip = (page - 1) * 10

        // Fetch comments for the specified post with pagination
        const comments = await prisma.forumComments.findMany({
            where: {
                post_id: post_id,
            },
            skip: skip,
            take: 10,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        image: {
                            select: { binary_blob: true, mime_type: true },
                        },
                    },
                },
            },
        });

        // Attatch author profile pictures to comments
        const comments_with_pfps = comments.map((comment) => ({
            ...comment,
            author_pfp: comment.author?.image
                ? `data:${comment.author.image.mime_type};base64,${Buffer.from(comment.author.image.binary_blob).toString("base64")}`
                : null,

            author_name: comment.author?.username,
            author: undefined,
        }));

        return json({
            comments_data: comments_with_pfps
        });
    } catch (e) {
        console.error(`[KITES | ERROR]: Error loading comments: ${e}`);
        throw error(500, `Error loading comments: ${e}`);
    }
}
