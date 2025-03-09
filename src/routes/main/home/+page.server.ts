// import { get_collection } from "$db/collection";

// Database testing
// export const load = async () => {
//     const kiteList = await get_collection('Test').find({}).toArray();

//     const serializableKites = kiteList.map((kite) => ({
//         _id: kite._id.toString(),
//         name: kite.name,
//         age: kite.age,
//         email: kite.email,
//         city: kite.city
//       }));
    
//     return {
//         kites: serializableKites
//     };
// }

// src/routes/main/home/+page.server.ts
import { prisma } from '$lib/server/prisma.server'; // Import Prisma client

// Define the Post type
type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
};

export const load = async () => {
  try {
    // Fetch posts using Prisma
    const limit = 10; // Number of posts to fetch per request
    const postList = await prisma.posts.findMany({
      take: limit, // Equivalent to MongoDB's `limit`
      orderBy: { createdAt: 'desc' } // Optional: Sort by creation date
    });

    // No need to convert createdAt to a string
    const serializablePosts: Post[] = postList.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt // Keep it as a Date object
    }));

    return {
      posts: serializablePosts
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return {
      posts: [] // Return an empty array if there's an error
    };
  }
};