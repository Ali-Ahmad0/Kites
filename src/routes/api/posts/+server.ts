import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma.server'; // Adjust the import path

export async function POST({ request }) {
  try {
    // Parse the request body
    const { title, content, userId } = await request.json();

    // Create the post using Prisma
    const post = await prisma.posts.create({
      data: {
        title,
        content,
        userId, // Replace with logged-in user's ID in the future
      },
    });

    // Return the created post as a response
    return json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}