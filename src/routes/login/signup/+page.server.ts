import  type { Actions } from './$types';
import { get_collection } from '$db/collection';
import { error as svelteError, fail } from "@sveltejs/kit";
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
			throw svelteError(400, "Email is required.");
		}
        
        // Check if user already exists
        const user_by_email = await collection.findOne({email});
        if (user_by_email != null) {
            throw svelteError(400, "Email already exists.");
        }

        const user_by_name = await collection.findOne({username});
        if(user_by_name != null) {
            throw svelteError(400, "Username is occupied. Please change.");
        }

        // Hash the password and insert new user
        const hashed_password = await hash(password);
        collection.insertOne({username: username, email: email, password: hashed_password});
        
        return { success: true };
    }


} satisfies Actions