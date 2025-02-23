import { get_collection } from "$db/collection";
import type { Actions } from "./$types";
import bcrypt from "bcryptjs";
import { error as svelteError, fail } from "@sveltejs/kit";

export const actions: Actions = {
    login: async ({ request }) => {
        try {
            // Get form data
            const data = await request.formData();
            const email = data.get("email") as string;
            const password = data.get("password") as string;

            // Check if required fields are filled
            if (!email || !password) {
                throw svelteError(400, "Email and password are required.");
            }

            const collection = get_collection("Users");
            const user = await collection.findOne({ email });

            // Check if user exists
            if (!user) {
                throw svelteError(400, "User not found.");
            }

            // Compare the entered password with the stored hashed password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                console.log('incorrect password');
                throw svelteError(400, "Incorrect password.");
            }

            return { success: true, message: "Login successful!" };


        } catch (error) {
            throw svelteError(500, "Something went wrong. Please try again.");
        }
    },

    // Signup with Google (Placeholder)
    google: async (event) => {
        // Google signup logic here
    },
};
