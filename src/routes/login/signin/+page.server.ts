import { get_collection } from "$db/collection";
import type { Actions } from "./$types";
import bcrypt from "bcryptjs";
import { fail } from "@sveltejs/kit";

export const actions: Actions = {
    login: async ({ request }) => {
        try {
            // Get form data
            const data = await request.formData();
            const email = data.get("email") as string;
            const password = data.get("password") as string;

            if (!email || !password) {
                return fail(400, { email, error: "Email and password are required." });
            }

            const collection = get_collection("Users");
            const user = await collection.findOne({ email });

            if (!user) {
                console.log('user not found');
                return fail(400, { email, error: "User not found." });
            }

            // Compare the entered password with the stored hashed password

            if (password != user.password) {
                console.log('incorrect password');
                return fail(400, { email, error: "Incorrect password." });
            }

            console.log('Login Successful.');
            return { success: true, message: "Login successful!" };


        } catch (error) {
            console.error("Error in login:", error);
            return fail(500, { error: "Something went wrong. Please try again." });
        }
    },

    // Signup with Google (Placeholder)
    google: async (event) => {
        // Google signup logic here
    },
};
