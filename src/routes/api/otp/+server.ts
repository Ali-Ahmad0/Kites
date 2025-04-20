import { dev } from '$app/environment';
import { validate_otp } from '$lib/server/otp.server.js';
import { prisma } from '$lib/server/prisma.server.js';
import { create_session } from '$lib/server/session.server';
import { json } from '@sveltejs/kit';

export async function POST({ cookies, request }) {
    try {
        const data = await request.json();

        const username = cookies.get("otp_username") as string;
        const password = cookies.get("otp_password") as string; // Hashed password
        const email = cookies.get("otp_email") as string;

        // Check for valid OTP session
        if (!email) {
            return json(
                { error: 'OTP session expired or invalid' }, 
                { status: 401 }
            );
        }

        // Validate OTP code
        let validated = await validate_otp(email, data.otp);
        if (!validated) {
            return json(
                { error: 'OTP is invalid' }, 
                { status: 400 }
            );
        }
        
        // Store new user in database
        const user = await prisma.users.create({
            data: {
                username: username,
                email: email,
                password: password
            }
        });

        // Create session
        const session_id = await create_session(user.id.toString());
        
        cookies.set("session", session_id, { 
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: !dev,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Clear temporary cookies
        ['otp_username', 'otp_password', 'otp_email'].forEach(name => {
            cookies.delete(name, { path: '/' });
        });
        
        return json({ success: true });
    } catch (e) {
        return json({ error: `Invalid request: ${e}` }, { status: 400 });
    }
}