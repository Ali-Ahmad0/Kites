import { prisma } from "$lib/server/prisma.server";
import type { Actions } from "@sveltejs/kit";

// export const actions : Actions = {
//     create: async({ request, cookies }) => {
//         await prisma.forumPosts.create({
//             data: {
//                 heading: "Example Heading",
//                 content: "Example content",
//                 author_id: "67bae2ef00f0c477d08f51f6",
//                 topic: "Art",
//                 likes: 0
//             }
//         })
//     }
// }