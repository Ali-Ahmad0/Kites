import  type { Actions } from './$types';
import { get_collection } from '$db/collection';
import { fail } from '@sveltejs/kit';


export const actions = {

    signup: async ({request}) => {

        // get form data
        const data = await request.formData();
        const username = data.get('name');
        const email = data.get('email');
        const password = data.get('password');

        const collection = get_collection('Users');

        if (!email) {
            console.log('enter email');
			return fail(400, { email, missing: true });
		}
        
        const user_by_email = await collection.findOne({email: email});

        if (user_by_email != null) {
            console.log('user already exists');
            return fail(400, { email, incorrect: true });
        }

        const user_by_name = await collection.findOne({username: username});

        if(user_by_name != null) {
            console.log('username occupied');
            return fail(400, { username, incorrect: true });
        }

        collection.insertOne({username: username, email: email, password: password});
        console.log('user added successfully.');
        
        return { success: true };
    }


} satisfies Actions