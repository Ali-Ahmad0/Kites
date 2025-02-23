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

            // Check if required fields are filled
            if (!email || !password) {
                return fail(400, { email, error: "Email and password are required." });
            }

            const collection = get_collection("Users");
            const user = await collection.findOne({ email });

            // Check if user exists
            if (!user) {
                return fail(400, { email, error: "User not found." });
            }

            // Compare the entered password with the stored hashed password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return fail(400, { email, error: "Incorrect password." });
            }

            return { success: true, message: "Login successful!" };


        } catch (error) {
            return fail(500, { error: "Something went wrong. Please try again." });
        }
    },

    // Signup with Google (Placeholder)
    google: async (event) => {
        // Google signup logic here
    },
};
