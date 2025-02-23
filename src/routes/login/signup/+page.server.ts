import  type { Actions } from './$types';
import { get_collection } from '$db/collection';
import { fail } from "@sveltejs/kit";
import { hash } from '$lib'

export const actions = {
    signup: async ({request}) => {
        try {
            // Get form data
            const data = await request.formData();

            const username = data.get('name') as string;
            const email = data.get('email') as string;
            const password = data.get('password') as string;
            const confirm = data.get('confirm_password') as string;

            // Validate password
            if (password.length < 8) {
                return fail(
                    400, { 
                        success: false,
                        password, invalid: true, 
                        message: "Pasword must be at least 8 characters" 
                });
            }

            if (password !== confirm) {
                return fail(
                    400, {
                        success: false,
                        password, invalid: true,
                        message: "Passwords do not match" 
                });
            }
            
            // Check if all fields are filled
            if (!username) { 
                return fail(
                    400, {
                        success: false, 
                        username, missing: true,
                        message: "Username is required" 
                });
            }

            if (!email) {
                return fail(
                    400, {
                        success: false, 
                        email, missing: true,
                        message: "Email is required" 
                });
            }

            if (!password) {
                return fail(
                    400, {
                        success: false, 
                        password, missing: true,
                        message: "Password is required" 
                });
            }

            const collection = get_collection('Users');
    
            // Check if user already exists
            const user_by_email = await collection.findOne({ email });
            if (user_by_email != null) {
                return fail(400, { 
                    success: false,
                    email, invalid: true,
                    message: "Email already exists"
                });
            }
            
            const user_by_name = await collection.findOne({ username });
            if (user_by_name != null) {
                return fail(400, { 
                    success: false,
                    username, invalid: true,
                    message: "Username already exists"
                });
            }

            // Hash the password and insert new user
            const hashed_password = await hash(password);
            collection.insertOne({username: username, email: email, password: hashed_password});
            
            return { success: true, message: "Signed up successfully" };
        } catch (error) {
            return fail(500, { success: false, message: "Internal server error" });
        }
    }


} satisfies Actions