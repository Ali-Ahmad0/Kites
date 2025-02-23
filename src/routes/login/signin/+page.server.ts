import { get_collection } from "$db/collection";
import type { Actions } from "./$types";
import bcrypt from "bcryptjs";
import { fail } from "@sveltejs/kit";

export const actions: Actions = {
    login: async ({ cookies, request }) => {
        try {
            // Get form data
            const data = await request.formData();
            const email = data.get("email") as string;
            const password = data.get("password") as string;

            // Validate password
            if (password.length < 8) {
                return fail(
                    400, { 
                        success: false,                        
                        password, invalid: true, 
                        message: "Pasword must be at least 8 characters" 
                });
            }

            // Check if required fields are filled
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

            const collection = get_collection("Users");
            const user = await collection.findOne({ email });

            // Check if user does not exist
            if (!user) {
                return fail(
                    400, { 
                        success: false,
                        email, invalid: true,
                        message: "User does not exist"
                });
            }

            // Compare the entered password with the stored hashed password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return fail(
                    400, {
                        success: false,
                        password, invalid: true, 
                        message: "Invalid password"
                });
            }
  
            return { success: true, message: "Login successful!" };

        } catch (error) {
            return fail(500, { success: false, message: "Internal server error" });
        }
    },

    // Signup with Google (Placeholder)
    google: async (event) => {
        // Google signup logic here
    },
};
