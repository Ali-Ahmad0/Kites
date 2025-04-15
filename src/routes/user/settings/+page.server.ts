// import { fail } from '@sveltejs/kit';
// import type { Actions } from './$types';

// export const actions = {
//   default: async ({ request, locals }) => {
//     const formData = await request.formData();
//     const username = formData.get('username');
//     const email = formData.get('email');
//     const avatar = formData.get('avatar');

//     // Add your validation logic here
//     if (!username || !email) {
//       return fail(400, { missing: true });
//     }

//     // Update user in database (pseudo-code)
//     try {
//       await locals.db.collection('users').updateOne(
//         { _id: locals.user._id },
//         { $set: { username, email, avatar } }
//       );
//       return { success: true };
//     } catch (err) {
//       return fail(500, { error: err.message });
//     }
//   }
// } satisfies Actions;

// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async ({ locals }) => {
//   if (!locals.user) {
//     return { user: null };
//   }

//   // Fetch user data from database
//   const user = await locals.db.collection('users').findOne({ 
//     _id: locals.user._id 
//   });

//   return {
//     user: {
//       username: user.username,
//       email: user.email,
//       avatar: user.avatar
//     }
//   };
// };