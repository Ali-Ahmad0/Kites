import { prisma } from "$lib/server/prisma.server.js";
import { error } from "@sveltejs/kit";

export async function load({params} : any ) {
    const {post_id} = params;

    const post = await prisma.forumPosts.findUnique({
        where: {
            id : post_id
        }
    })

    if (!post){
        throw error(
            404,{
            message:"Post not found"
        })
    }

    const image = await prisma.images.findFirst({
        where: { post_id: post_id },
        select: {
          binary_blob: true,
          mime_type: true
        }
    });
      
    let dataUrl = null;
    if (image) {
        // Convert Prisma Bytes (Buffer) to base64
        const base64 = Buffer.from(image.binary_blob).toString('base64');
        dataUrl = `data:${image.mime_type};base64,${base64}`;
        console.log("Image found and converted to data URL");
    } else {
        console.log("No image found for this post");
    }

    console.log("Post data returned successfully");
    return {
        heading: post.heading,
        content: post.content,
        author: post.author_name,
        topic: post.topic,
        image: dataUrl
    }
}