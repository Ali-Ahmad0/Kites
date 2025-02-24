import type { Actions } from './$types';
import { get_collection } from '$db/collection';
import { fail, redirect } from "@sveltejs/kit";
import { hash } from '$lib';

export const actions = {
    signup: async ({ request }) => {
        try {
            const data = await request.formData();
            const username = data.get('name') as string;
            const email = data.get('email') as string;
            const password = data.get('password') as string;
            const confirm = data.get('confirm_password') as string;

            // Validate password
            if (password.length < 8) {
                return fail(400, { 
                    success: false,
                    password: { invalid: true, message: "Password must be at least 8 characters" },
                    username: { value: username },
                    email: { value: email }
                });
            }

            // Compare passwords
            if (password !== confirm) {
                return fail(400, {
                    success: false,
                    password: { invalid: true, message: "Passwords do not match" },
                    confirm_password: { invalid: true, message: "Passwords do not match" },
                    username: { value: username },
                    email: { value: email }
                });
            }
            
            // Check if all fields are entered
            if (!username) { 
                return fail(400, {
                    success: false, 
                    username: { missing: true, message: "Username is required" },
                    email: { value: email }
                });
            }

            if (!email) {
                return fail(400, {
                    success: false, 
                    email: { missing: true, message: "Email is required" },
                    username: { value: username }
                });
            }

            if (!password) {
                return fail(400, {
                    success: false, 
                    password: { missing: true, message: "Password is required" },
                    username: { value: username },
                    email: { value: email }
                });
            }

            const collection = get_collection('Users');

            // Check if email is available
            const user_by_email = await collection.findOne({ email });
            if (user_by_email != null) {
                return fail(400, { 
                    success: false,
                    email: { invalid: true, message: "Email already exists" },
                    username: { value: username }
                });
            }
            
            // Check if username is available
            const user_by_name = await collection.findOne({ username });
            if (user_by_name != null) {
                return fail(400, { 
                    success: false,
                    username: { invalid: true, message: "Username already exists" },
                    email: { value: email }
                });
            }

            // Store new user in database
            const hashed_password = await hash(password);
            collection.insertOne({ username, email, password: hashed_password });
            
            return { success: true, message: "Signup successful" };
        } catch (error) {
            return fail(500, { success: false, message: "Internal server error" });
        }
    }
} satisfies Actions;