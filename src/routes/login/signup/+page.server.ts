import  type { Actions } from './$types';
import { get_collection } from '$db/collection';
import { fail } from '@sveltejs/kit';
import { hash } from '$lib'


export const actions = {
    signup: async ({request}) => {

        // get form data
        const data = await request.formData();
        const username = data.get('name');
        const email = data.get('email');
        const password = data.get('password');

        const collection = get_collection('Users');

        // Check if all fields are filled
        if (!email) {
			return fail(400, { email, missing: true });
		}
        
        // Check if user already exists
        const user_by_email = await collection.findOne({email: email});
        if (user_by_email != null) {
            return fail(400, { email, incorrect: true });
        }

        const user_by_name = await collection.findOne({username: username});
        if(user_by_name != null) {
            return fail(400, { username, incorrect: true });
        }

        // Hash the password and insert new user
        const hashed_password = await hash(password);
        collection.insertOne({username: username, email: email, password: hashed_password});
        
        return { success: true };
    }


} satisfies Actions