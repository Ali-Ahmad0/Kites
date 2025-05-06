import type { Actions } from './$types';
import { fail } from "@sveltejs/kit";
import { hash } from '$lib'
import { prisma } from "$lib/server/prisma.server";
import { dev } from "$app/environment";
import { generate_otp } from '$lib/server/otp.server';

export const actions : Actions = {
    signup: async ({ request, cookies }) => {
        try {
            const data = await request.formData();
            
            const username = data.get('name') as string;
            const email = data.get('email') as string;
            const password = data.get('password') as string;
            const confirm = data.get('confirm_password') as string;
            
            const username_regex = /^[a-zA-Z0-9_-]+$/;

            // check if the username contains spaces
            if(!username_regex.test(username)){
                return fail(400,{
                    success: false,
                    username: { invalid: true, message: "Invalid Username" },
                    password: { value: password },
                    email: { value: email }
                });
            }

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

            // Check if email is available
            const email_exists = await prisma.users.findUnique({
                where: {
                    email : email
                },
                select: { id: true }
            });

            if (email_exists) {
                return fail(400, { 
                    success: false,
                    email: { invalid: true, message: "Email already exists" },
                    username: { value: username }
                });
            }
            
            // Check if username is available
            const username_exists = await prisma.users.findUnique({
                where: {
                    username: username
                },
                select: { id: true }
            });

            if (username_exists) {
                return fail(400, { 
                    success: false,
                    username: { invalid: true, message: "Username already exists" },
                    email: { value: email }
                });
            }

            const hashed_password = await hash(password);

            // Store OTP verification data in cookies
            cookies.set("otp_username", username, { 
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: !dev,
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            cookies.set("otp_password", hashed_password, { 
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: !dev,
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            cookies.set("otp_email", email, {
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: !dev,
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            await generate_otp(email);
            
            return { success: true, message: "Sending OTP..." };
        } catch (e) {
            return fail(500, { success: false, message: "Internal server error" });
        }
    }
} satisfies Actions;