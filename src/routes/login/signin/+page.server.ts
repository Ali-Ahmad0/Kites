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

            // Check if required fields are filled
            if (!email || !password) {
                return fail(400, { missing: true });
            }

            const collection = get_collection("Users");
            const user = await collection.findOne({ email });

            // Check if user exists
            if (!user) {
                return fail(400, { invalid: true });
            }

            // Compare the entered password with the stored hashed password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return fail(400, { invalid: true });
            }

            return { success: true, message: "Login successful!" };

        } catch (error) {
            return fail(400, { invalid: true });
        }
    },

    // Signup with Google (Placeholder)
    google: async (event) => {
        // Google signup logic here
    },
};
