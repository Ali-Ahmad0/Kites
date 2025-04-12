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

    return {
        heading: post.heading,
        content: post.content,
        author: post.author_name,
        topic: post.topic
    }
}