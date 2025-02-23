import  type { Actions } from './$types';
import { get_collection } from '$db/collection';
import { fail } from "@sveltejs/kit";
import { hash } from '$lib'

export const actions = {
    signup: async ({request}) => {
        // get form data
        const data = await request.formData();

        const username = data.get('name') as string;
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const confirm = data.get('confirm_password') as string;

        const collection = get_collection('Users');

        // Validate password
        if (password.length < 8 || password !== confirm) {
            return fail(400, { invalid: true });
        }
        
        // Check if all fields are filled
        if (!username || !email || !password) { 
            return fail(400, { missing: true });
        }
        
        // Check if user already exists
        const user_by_email = await collection.findOne({ email });
        if (user_by_email != null) {
            return fail(400, { invalid: true });
        }

        const user_by_name = await collection.findOne({username});
        if(user_by_name != null) {
            return fail(400, { invalid: true });
        }

        // Hash the password and insert new user
        const hashed_password = await hash(password);
        collection.insertOne({username: username, email: email, password: hashed_password});
        
        return { success: true };
    }


} satisfies Actions