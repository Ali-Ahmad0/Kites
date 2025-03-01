import { get_collection } from "$db/collection";
import type { Actions } from "./$types";
import bcrypt from "bcryptjs";
import { fail } from "@sveltejs/kit";
import { create_session } from "$lib/helper/session";
import { dev } from "$app/environment";


export const actions: Actions = {
    login: async ({ request, cookies }) => {
        try {
            const data = await request.formData();
            const email = data.get("email") as string;
            const password = data.get("password") as string;

            // Validate password
            if (password.length < 8) {
                return fail(400, { 
                    success: false,                        
                    password: { invalid: true, message: "Password must be at least 8 characters" },
                    email: { value: email }
                });
            }
            
            // Check if all fields are entered
            if (!email) {
                return fail(400, { 
                    success: false,
                    email: { missing: true, message: "Email is required" }
                });
            }

            if (!password) {
                return fail(400, { 
                    success: false,                        
                    password: { missing: true, message: "Password is required" },
                    email: { value: email }
                });
            }

            const collection = get_collection("Users");
            const user = await collection.findOne({ email });

            // Check if user exists
            if (!user) {
                return fail(400, { 
                    success: false,
                    email: { invalid: true, message: "User does not exist" }
                });
            }

            // Check for correct password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return fail(400, {
                    success: false,
                    password: { invalid: true, message: "Invalid password" },
                    email: { value: email }
                });
            }
            
            // Create session
            const session_id = await create_session(user._id.toString());
            cookies.set("session", session_id, { 
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: !dev,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return { success: true, message: "Login successful" };
        } catch (error) {
            return fail(500, { success: false, message: "Internal server error" });
        }
    },

    google: async (event) => {
        // Google signup logic here
    },
};